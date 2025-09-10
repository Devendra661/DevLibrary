// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuth.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';

// Layouts
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import StudentLayout from "./pages/student/StudentLayout.jsx";

// Pages
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import BooksAdmin from "./pages/admin/Books.jsx";

import ProfileAdmin from "./pages/admin/Profile.jsx";
import AddBook from "./pages/admin/AddBook.jsx";
import AddStudent from "./pages/admin/AddStudent.jsx";
import BookRequests from "./pages/admin/BookRequests.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import BooksStudent from "./pages/student/Books.jsx";
import ProfileStudent from "./pages/student/Profile.jsx";
import IssueIDCard from "./pages/admin/IssueIDCard.jsx";
import RecentTransactions from "./pages/admin/RecentTransactions.jsx";
import IDCardPage from "./pages/student/IDCardPage.jsx";
import History from "./pages/student/History.jsx";
import AllStudents from "./pages/admin/AllStudents.jsx";
import BorrowedBooks from "./pages/student/BorrowedBooks.jsx";
import Loader from "./components/Loader.jsx";

export default function App() {
  const { user, isAuthReady, init } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAuthReady || isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;
  }

  return (
    <>
      <ToastContainer />
      <Router>
      <Routes>
        {/* Public Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/books"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <BooksAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/student-id-card"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <IssueIDCard />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/profile"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <ProfileAdmin />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/add-book"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <AddBook />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/add-student"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <AddStudent />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/transactions"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <RecentTransactions />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/book-requests"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <BookRequests />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/students"
          element={
            user?.role === "librarian" ? (
              <AdminLayout>
                <AllStudents />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/books"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <BooksStudent />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/profile"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <ProfileStudent />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/idcard"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <IDCardPage />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/borrowed"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <BorrowedBooks />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/history"
          element={
            user?.role === "student" ? (
              <StudentLayout>
                <History />
              </StudentLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}
