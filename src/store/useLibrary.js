// src/store/useLibrary.js
import { create } from "zustand";

const BASE_URL = "http://localhost:5000"; // Backend URL

export const useLibraryStore = create((set) => ({
  books: [],
  bookRequests: [], // New state for book requests

  // Load all book requests
  loadBookRequests: async () => { // New action
    try {
      const res = await fetch(`${BASE_URL}/api/book-requests`);
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
      const res = await fetch(`${BASE_URL}/api/books`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const books = await res.json();
      set({ books });
      console.log("Books loaded:", books.length);

      // Also load book requests
      useLibraryStore.getState().loadBookRequests(); // Call new action
    } catch (err) {
      console.error("Error loading books:", err);
    }
  },

  // Borrow a book
  borrowBook: async (bookId, studentId) => {
    console.log("DEBUG: BorrowBook called with:", { bookId, studentId });

    if (!bookId || !studentId) {
      console.error("Book ID or Student ID missing");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/book-requests`, {
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
      }
    } catch (err) {
      console.error("Network error while requesting book:", err);
    }
  },

  // Return a book
  returnBook: async (bookId, studentId) => {
    console.log("DEBUG: ReturnBook called with:", { bookId, studentId });

    if (!bookId || !studentId) {
      console.error("Book ID or Student ID missing");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/books/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to return book:", error.message);
      } else {
        const responseData = await res.json();
        const returnedBorrowedBook = responseData.book; // Backend now sends the updated borrowed book

        set((state) => ({
          // Update the books state (available copies)
          books: state.books.map((b) =>
            b.bookId === responseData.book.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
          ),
          // Update the bookRequests state (set status to returned and returnedDate)
          bookRequests: state.bookRequests.map((req) =>
            req._id === responseData.book._id ? { ...req, status: 'returned', returnedDate: responseData.book.returnedDate } : req
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
    console.log("DEBUG: LikeBook called with:", bookId);

    if (!bookId) {
      console.error("Book ID missing");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/books/like`, {
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
