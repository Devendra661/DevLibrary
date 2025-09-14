// src/pages/Books.jsx
import { useLibraryStore } from "../../store/useLibrary.js";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BookCard from "../../components/BookCard.jsx";
import Modal from "../../components/Modal.jsx";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import UpdateBook from "./UpdateBook.jsx";

export default function Books() {
  const { books, loadBooks, deleteBook } = useLibraryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const handleMoreClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        handleCloseModal();
        toast.success("Book deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete book: " + error.message);
      }
    }
  };

  const handleUpdateBook = (book) => {
    setSelectedBook(book.bookId);
    setIsUpdateModalOpen(true);
    setIsModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          All Books
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “There is more treasure in books than in all the pirate's loot on Treasure Island.”
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {books.map((book) => (
          <motion.div
            key={book.bookId}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -8,
              boxShadow:
                "0px 0px 15px rgba(245, 245, 245, 0.8), 0px 0px 25px rgba(245, 245, 245, 0.6)", // whitesmoke glow
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-200 transition-all duration-300"
          >
            <BookCard book={book} onMoreClick={handleMoreClick} />
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedBook={selectedBook}
        onDelete={handleDeleteBook}
      >
        {selectedBook && (
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedBook.coverImageUrl}
              alt={selectedBook.title}
              className="w-32 h-48 sm:w-48 sm:h-64 object-cover rounded mb-4 shadow-md"
            />
            <h2 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2">
              {selectedBook.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              by {selectedBook.author}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              {selectedBook.description}
            </p>
            <p className="text-sm sm:text-md text-gray-700 mb-2">
              Category: {selectedBook.category}
            </p>
            <div className="flex items-center justify-center w-full text-md text-gray-700 mb-4">
              <span
                className={`font-semibold ${
                  selectedBook.availableCopies > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedBook.availableCopies > 0
                  ? `Available (${selectedBook.availableCopies})`
                  : "Borrowed"}
              </span>
              <span className="flex items-center gap-1 text-red-500 ml-4">
                <FaHeart /> {selectedBook.likes}
              </span>
            </div>

            <div className="flex gap-4">
              {/* Delete Button */}
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 15px rgba(255, 0, 0, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-red-600 transition-all"
                onClick={() => handleDeleteBook(selectedBook.bookId)}
              >
                Delete
              </motion.button>

              {/* Update Button */}
              <motion.button
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 15px rgba(0, 255, 0, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-green-600 transition-all"
                onClick={() => handleUpdateBook(selectedBook)}
              >
                Update
              </motion.button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Book Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        {selectedBook && (
          <UpdateBook bookId={selectedBook} onClose={handleCloseUpdateModal} />
        )}
      </Modal>
    </div>
  );
}
