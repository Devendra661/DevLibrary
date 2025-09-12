import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function Modal({ isOpen, onClose, children, selectedBook, onBorrow, onLike, onDelete }) {
  if (!isOpen) return null;

  const isAvailable = selectedBook?.availableCopies > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Box */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-3/4 md:max-w-lg p-6 relative z-10"
            initial={{ scale: 0.7, opacity: 0, y: -50, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -50, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{
              scale: 1.03,
              rotateX: 0,
              rotateY: 3,
              boxShadow:
                "0px 25px 50px rgba(0,0,0,0.3), 0px 0px 30px rgba(59,130,246,0.3)",
            }}
          >
            {/* 3D Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 shadow-md"
              whileHover={{
                scale: 1.2,
                rotate: 45,
                boxShadow:
                  "0px 8px 15px rgba(0,0,0,0.3), inset 0px 2px 5px rgba(255,255,255,0.4)",
              }}
              whileTap={{
                scale: 0.95,
                boxShadow:
                  "0px 4px 8px rgba(0,0,0,0.2), inset 0px 1px 3px rgba(255,255,255,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ✕
            </motion.button>

            {/* Modal Content */}
            <div className="space-y-4">{children}</div>

            {/* 3D Borrow & Like Buttons */}
            {selectedBook && (
              <div className="flex gap-6 justify-center mt-6">
                {/* Borrow */}
                {isAvailable && onBorrow && (
                  <motion.button
                    onClick={() => onBorrow(selectedBook.bookId)}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 border border-orange-600"
                    whileHover={{
                      scale: 1.08,
                      rotateX: -5,
                      rotateY: 5,
                      boxShadow:
                        "0px 20px 35px rgba(0,0,0,0.35), inset 0px 2px 6px rgba(255,255,255,0.2)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      rotateX: 0,
                      rotateY: 0,
                      boxShadow:
                        "0px 8px 15px rgba(0,0,0,0.2), inset 0px 1px 3px rgba(255,255,255,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Borrow
                  </motion.button>
                )}

                {/* Like */}
                {onLike && (
                  <motion.button
                    onClick={() => onLike(selectedBook.bookId)}
                    className="px-6 py-3 flex items-center justify-center gap-2 font-bold rounded-xl shadow-lg border bg-red-500 text-white border-red-600"
                    whileHover={{
                      scale: 1.08,
                      rotateX: -5,
                      rotateY: 5,
                      boxShadow:
                        "0px 20px 35px rgba(0,0,0,0.35), inset 0px 2px 6px rgba(255,255,255,0.2)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      rotateX: 0,
                      rotateY: 0,
                      boxShadow:
                        "0px 8px 15px rgba(0,0,0,0.2), inset 0px 1px 3px rgba(255,255,255,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <FaHeart /> Like
                  </motion.button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <motion.button
                    onClick={() => onDelete(selectedBook.bookId)}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 border border-red-700"
                    whileHover={{
                      scale: 1.08,
                      rotateX: -5,
                      rotateY: 5,
                      boxShadow:
                        "0px 20px 35px rgba(0,0,0,0.35), inset 0px 2px 6px rgba(255,255,255,0.2)",
                    }}
                    whileTap={{
                      scale: 0.95,
                      rotateX: 0,
                      rotateY: 0,
                      boxShadow:
                        "0px 8px 15px rgba(0,0,0,0.2), inset 0px 1px 3px rgba(255,255,255,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Delete
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}