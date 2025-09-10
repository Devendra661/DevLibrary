import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuth.js";
import { useLibraryStore } from "../../store/useLibrary.js";
import { FaBook } from "react-icons/fa";

export default function BorrowedBooks() {
  const { user } = useAuthStore();
  const { bookRequests, loadBookRequests, books, loadBooks } = useLibraryStore();
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    loadBooks();
    loadBookRequests();
  }, []);

  useEffect(() => {
    if (user && bookRequests && books) {
      const userBorrowed = bookRequests
        .filter(
          (req) =>
            req.studentId === user?.username &&
            req.status === "approved" &&
            !req.returnedDate
        )
        .map((req) => {
          const book = books.find((book) => book.bookId === req.bookId);
          return {
            ...req,
            bookTitle: book ? book.title : "Unknown Book",
            author: book ? book.author : "Unknown Author",
            coverImageUrl: book ? book.coverImageUrl : "",
          };
        });
      setBorrowedBooks(userBorrowed);
    }
  }, [user, bookRequests, books]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8  "
    >
      {/* Heading + Quote */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 drop-shadow-[0_0_8px_orangered]">
          Borrowed Books
        </h1>
        <p className="mt-2 italic text-gray-600 text-sm">
          “That's the thing about books. They let you travel without moving your
          feet.”
        </p>
      </div>

      {borrowedBooks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No books currently borrowed.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {borrowedBooks.map((book) => (
            <motion.div
              key={book._id}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0px 0px 15px rgba(255,69,0,0.4), 0px 0px 30px rgba(255,140,0,0.3)",
              }}
              className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            >
              {/* Book Cover */}
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.bookTitle}
                  className="w-20 h-28 object-cover rounded-lg shadow"
                />
              ) : (
                <div className="w-20 h-28 flex items-center justify-center bg-orange-200 rounded-lg">
                  <FaBook className="text-white text-2xl" />
                </div>
              )}

              {/* Book Info */}
              <div className="flex-1">
                <h2 className="font-bold text-lg text-gray-800 mb-1">
                  {book.bookTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-xs text-gray-500">
                  Borrowed on:{" "}
                  <span className="font-medium">
                    {new Date(book.borrowDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Due:{" "}
                  <span className="font-medium text-red-500">
                    {new Date(book.dueDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
