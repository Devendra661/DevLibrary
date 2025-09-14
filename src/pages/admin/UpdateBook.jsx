import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLibraryStore } from "../../store/useLibrary.js";

export default function UpdateBook({ bookId, onClose }) {
  const { updateBook } = useLibraryStore();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    availableCopies: 0,
    likes: 0,
  });
  const [coverImageFile, setCoverImageFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`);
        if (response.ok) {
          const book = await response.json();
          setBookData(book);
        } else {
          toast.error("Failed to fetch book data.");
        }
      } catch (error) {
        toast.error("An error occurred: " + error.message);
      }
    };
    fetchBookData();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]:
        name === "availableCopies" || name === "likes"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
    } else {
      setCoverImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in bookData) {
      formData.append(key, bookData[key]);
    }
    if (coverImageFile) {
      formData.append("coverImage", coverImageFile);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updatedBook = await res.json();
        updateBook(updatedBook);
        toast.success("Book updated successfully!");
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update book.");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Update Book
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-[0_0_10px_rgba(255,69,0,0.25)] overflow-hidden"
      >
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              `url(${bookData.coverImageUrl || '/add_book.jpg'})`,
            minHeight: "400px",
          }}
        ></div>

        <div className="p-6 bg-white text-black">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-black"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-semibold text-black"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-black"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-black"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={bookData.category}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="availableCopies"
                  className="block text-sm font-semibold text-black"
                >
                  Copies
                </label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={bookData.availableCopies}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label
                  htmlFor="likes"
                  className="block text-sm font-semibold text-black"
                >
                  Likes
                </label>
                <input
                  type="number"
                  id="likes"
                  name="likes"
                  value={bookData.likes}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Cover Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-1.5 rounded-md font-bold text-white 
               bg-blue-500 
               shadow-[0_0_8px_deepskyblue,0_0_12px_deepskyblue,0_0_20px_deepskyblue] 
               hover:bg-blue-600 
               hover:shadow-[0_0_12px_deepskyblue,0_0_18px_deepskyblue,0_0_25px_deepskyblue] 
               transition-all text-xs"
              >
                📘 Upload Cover Image
              </button>

              {coverImageFile ? (
                <div className="mt-3 flex justify-center">
                  <img
                    src={URL.createObjectURL(coverImageFile)}
                    alt="Cover Preview"
                    className="w-28 h-36 object-cover rounded-md border border-blue-400 shadow-[0_0_10px_deepskyblue]"
                  />
                </div>
              ) : (
                bookData.coverImageUrl && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={bookData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-28 h-36 object-cover rounded-md border border-blue-400 shadow-[0_0_10px_deepskyblue]"
                    />
                  </div>
                )
              )}
            </div>


            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-md font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_8px_orangered] transition-transform transform hover:scale-105 text-sm"
            >
              🚀 Update Book
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
