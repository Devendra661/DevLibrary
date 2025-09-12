// src/store/useLibrary.js
import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_API_URL; // <-- use env variable

export const useLibraryStore = create((set) => ({
  books: [],
  bookRequests: [],

  // Load all book requests
  loadBookRequests: async () => {
    try {
      const res = await fetch(`${BASE_URL}/book-requests`);
      if (!res.ok) throw new Error("Failed to fetch book requests");
      const bookRequests = await res.json();
      set({ bookRequests });
      console.log("Book requests loaded:", bookRequests.length);
    } catch (err) {
      console.error("Error loading book requests:", err);
    }
  },

  // Load all books
  loadBooks: async () => {
    try {
      const res = await fetch(`${BASE_URL}/books`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const books = await res.json();
      set({ books });
      console.log("Books loaded:", books.length);

      // Also load book requests
      useLibraryStore.getState().loadBookRequests();
    } catch (err) {
      console.error("Error loading books:", err);
    }
  },

  // Borrow a book
  borrowBook: async (bookId, studentId) => {
    if (!bookId || !studentId) return console.error("Book ID or Student ID missing");

    try {
      const res = await fetch(`${BASE_URL}/book-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to request book:", error.message);
      } else {
        const data = await res.json();
        console.log("Book requested successfully:", data);
        useLibraryStore.getState().loadBookRequests();
      }
    } catch (err) {
      console.error("Network error while requesting book:", err);
    }
  },

  // Return a book
  returnBook: async (bookId, studentId) => {
    if (!bookId || !studentId) return console.error("Book ID or Student ID missing");

    try {
      const res = await fetch(`${BASE_URL}/books/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to return book:", error.message);
      } else {
        const responseData = await res.json();
        const returnedBorrowedBook = responseData.book;

        set((state) => ({
          books: state.books.map((b) =>
            b.bookId === returnedBorrowedBook.bookId
              ? { ...b, availableCopies: b.availableCopies + 1 }
              : b
          ),
          bookRequests: state.bookRequests.map((req) =>
            req._id === returnedBorrowedBook._id
              ? { ...req, status: 'returned', returnedDate: returnedBorrowedBook.returnedDate }
              : req
          ),
        }));
        console.log("Book returned successfully:", returnedBorrowedBook.bookId);
      }
    } catch (err) {
      console.error("Network error while returning book:", err);
    }
  },

  // Like a book
  likeBook: async (bookId) => {
    if (!bookId) return console.error("Book ID missing");

    try {
      const res = await fetch(`${BASE_URL}/books/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to like book:", error.message);
      } else {
        const updatedBook = await res.json();
        set((state) => ({
          books: state.books.map((b) =>
            b.bookId === updatedBook.book.bookId ? updatedBook.book : b
          ),
        }));
        console.log("Book liked successfully:", updatedBook.book.bookId);
      }
    } catch (err) {
      console.error("Network error while liking book:", err);
    }
  },
}));
