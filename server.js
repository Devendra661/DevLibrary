import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: [
    "https://devlib.netlify.app",
    "https://erp-devlibrary.netlify.app",
    "https://devlibrary-3.onrender.com/api",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}));
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Save files to public/uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});
const upload = multer({ storage: storage });

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "libraryDB", tls: true, serverSelectionTimeoutMS: 30000 })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Find the maximum existing bookId number
    const lastBook = await Book.findOne().sort({ bookId: -1 });
    let maxBookIdNum = 0;
    if (lastBook && lastBook.bookId) {
      const lastNum = parseInt(lastBook.bookId.replace('DLB', ''));
      if (!isNaN(lastNum)) {
        maxBookIdNum = lastNum;
      }
    }

    // Initialize or update bookId counter to be greater than max existing bookId
    const counter = await Counter.findOneAndUpdate(
      { _id: 'bookId' },
      { $set: { seq: maxBookIdNum + 1 } }, // Explicitly set seq
      { upsert: true, new: true }
    );

    if (counter.seq <= maxBookIdNum) {
        const updatedCounter = await Counter.findOneAndUpdate(
            { _id: 'bookId' },
            { $set: { seq: maxBookIdNum + 1 } },
            { new: true }
        );
        console.log(`Book ID counter adjusted to: ${updatedCounter.seq}`);
    } else {
        console.log(`Book ID counter initialized to: ${counter.seq}`);
    }

    console.log("✅ MongoDB connected");
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("✅ MongoDB connection is open");
});
db.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

// Schemas
const BookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  category: String,
  coverImageUrl: String,
  availableCopies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});
const Book = mongoose.model("Book", BookSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['librarian', 'student', 'patron'], default: 'student' },
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  address: { type: String },
});
const User = mongoose.model("User", UserSchema);



const BookRequestSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  studentId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  studentName: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'returned'], default: 'pending' },
  borrowDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  returnedDate: { type: Date, default: null },
});
const BookRequest = mongoose.model("BookRequest", BookRequestSchema);

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  number: { type: String },
  address: { type: String },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
});
const Student = mongoose.model("Student", StudentSchema);

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const NotificationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
const Notification = mongoose.model('Notification', NotificationSchema);

// API Routes
app.get("/api/test", (req, res) => {
  res.send("OK");
});

app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});



app.get("/api/book-requests", async (req, res) => {
  const bookRequests = await BookRequest.find();
  res.json(bookRequests);
});

app.post("/api/book-requests", async (req, res) => {
  const { bookId, studentId } = req.body;
  console.log("Received book request with studentId:", studentId);
  try {
    const book = await Book.findOne({ bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const student = await Student.findOne({ studentId });
    console.log("Found student:", student);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const bookRequest = new BookRequest({
      bookId,
      studentId,
      bookTitle: book.title,
      studentName: student.studentName,
    });

    await bookRequest.save();
    res.status(201).json(bookRequest);
  } catch (error) {
    console.error("Error creating book request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/book-requests/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const bookRequest = await BookRequest.findById(id);
    if (!bookRequest) {
      return res.status(404).json({ message: "Book request not found" });
    }

    if (status === 'approved') {
      const { bookId, studentId } = bookRequest;
      const book = await Book.findOne({ bookId });
      if (!book || book.availableCopies <= 0) {
        return res.status(400).json({ message: "Book not available" });
      }

      book.availableCopies--;
      await book.save();

      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days from now

      bookRequest.status = 'approved';
      bookRequest.borrowDate = borrowDate;
      bookRequest.dueDate = dueDate;
      await bookRequest.save();

      res.json({ message: "Book request approved successfully" });
    } else if (status === 'rejected') {
      bookRequest.status = 'rejected';
      await bookRequest.save();
      res.json({ message: "Book request rejected successfully" });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    console.error("Error updating book request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching single student:", error);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

app.put("/api/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { oldPassword, password, ...otherUpdates } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (password) {
      if (!oldPassword || student.password !== oldPassword) {
        return res.status(401).json({ message: "Incorrect old password." });
      }
      student.password = password;
    }

    const allowedUpdates = ['emailId', 'number'];
    for (const key of allowedUpdates) {
      if (otherUpdates[key] !== undefined) {
        student[key] = otherUpdates[key];
      }
    }

    await student.save();
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error updating student" });
  }
});

app.delete(`${import.meta.env.VITE_API_URL}/students:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully", deletedStudent });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

app.post("/api/books", upload.single('coverImage'), async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'bookId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newBookId = `DLB${counter.seq}`;

    const bookData = { ...req.body, bookId: newBookId };
    if (req.file) {
      bookData.coverImageUrl = `/uploads/${req.file.filename}`;
    }

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(400).json({ message: error.message });
  }
});





app.post("/api/books/return", async (req, res) => {
  const { bookId, studentId } = req.body;
  try {
    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.availableCopies++;
    await book.save();

    // Find the approved BookRequest and update its status and returnedDate
    const bookRequest = await BookRequest.findOneAndUpdate(
      { bookId, studentId, status: 'approved' }, // Find the approved book request
      { status: 'returned', returnedDate: new Date() }, // Set status to 'returned' and set returnedDate
      { new: true }
    );

    if (!bookRequest) {
      return res.status(404).json({ message: "Approved BookRequest not found or already returned." });
    }

    res.json({ message: "Book returned successfully", book: bookRequest });
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).json({ message: "Server error during returning" });
  }
});

app.post("/api/books/like", async (req, res) => {
  const { bookId } = req.body;
  try {
    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.likes++;
    await book.save();

    res.json({ message: "Book liked successfully", book });
  } catch (error) {
    console.error("Like book error:", error);
    res.status(500).json({ message: "Server error during liking" });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const { studentId, studentName, bookId, bookTitle, message } = req.body;
    const notification = new Notification({ studentId, studentName, bookId, bookTitle, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error marking notification as read" });
  }
});

app.post("/api/students", upload.single('image'), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) {
      studentData.image = `/uploads/${req.file.filename}`;
    }
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`DEBUG: Login attempt for username: ${username}, password: ${password}`);

  try {
    const student = await Student.findOne({ studentId: username, password });
    console.log(`DEBUG: Student query result: ${JSON.stringify(student)}`);
    if (student) {
      console.log(`DEBUG: Student login successful for studentId: ${student.studentId}`);
      return res.json({ _id: student._id, username: student.studentId, role: 'student' });
    }

    const user = await User.findOne({ username, password, role: 'librarian' });
    console.log(`DEBUG: Librarian query result: ${JSON.stringify(user)}`);
    if (user) {
      console.log(`DEBUG: Librarian login successful for username: ${user.username}`);
      return res.json(user);
    }

    res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    console.error("Login error:", error);
    console.log(error)
    res.status(500).json({ message: "Server error during login" });
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve React in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), 'dist');
  console.log(`Serving static files from: ${distPath}`);

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.error(`Error: 'dist' directory not found at ${distPath}`);
  }
}


app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));