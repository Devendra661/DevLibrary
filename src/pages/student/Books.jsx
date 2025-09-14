import { useLibraryStore } from "../../store/useLibrary.js";
import { useAuthStore } from "../../store/useAuth.js";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../../components/BookCard.jsx";
import Modal from "../../components/Modal.jsx";
import { FaSearch } from "react-icons/fa";

// Notification Component
const Notification = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </motion.div>
  );
};

export default function Books() {
  const { books, loadBooks, borrowBook, likeBook } = useLibraryStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

  useEffect(() => {
    loadBooks();
  }, []);

  const handleBorrow = (bookId) => {
    if (!user) {
      setNotification({ message: "Please log in to borrow books.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    borrowBook(bookId, user.username); // Pass the user object
    setSelectedBook((prevBook) =>
      prevBook
        ? { ...prevBook, availableCopies: prevBook.availableCopies - 1 }
        : null
    );
    setIsModalOpen(false); // Close modal after borrowing
    setNotification({ message: "Request sent successfully!", type: "success" });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleLike = (bookId) => {
    likeBook(bookId);
    setSelectedBook((prevBook) =>
      prevBook ? { ...prevBook, likes: prevBook.likes + 1 } : null
    );
  };

  const handleMoreClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="p-6">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Available Books
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “A book is a dream that you hold in your hand.”
        </p>
      </div>
      <div className="relative mb-6">
        <input
          type="text"
          className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredBooks.map((book) => (
          <motion.div key={book.bookId} variants={itemVariants}>
            <BookCard book={book} onMoreClick={handleMoreClick} />
          </motion.div>
        ))}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedBook={selectedBook}
        onBorrow={handleBorrow}
        onLike={handleLike}
      >
        {selectedBook && (
          <div className="flex flex-col items-center text-center">
            <img
              src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${selectedBook.coverImageUrl}`}
              alt={selectedBook.title}
              className="w-32 h-48 sm:w-full sm:max-w-xs sm:h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2">{selectedBook.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">by {selectedBook.author}</p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">{selectedBook.description}</p>
            <p className="text-sm sm:text-md text-gray-700 mb-2">Category: {selectedBook.category}</p>
            <div className="flex items-center justify-center w-full text-md text-gray-700 mb-4 gap-4">
              <span
                className={`font-semibold ${
                  selectedBook.availableCopies > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedBook.availableCopies > 0
                  ? `Available (${selectedBook.availableCopies})`
                  : "Borrowed"}
              </span>
              <span className="flex items-center gap-1 text-red-500 font-semibold">
                {selectedBook.likes} ❤️
              </span>
            </div>
          </div>
        )}
      </Modal>

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
