// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import Footer from "../../components/Footer.jsx";

import {
  FaTachometerAlt,
  FaBook,
  FaUser,
  FaUserGraduate,
  FaUserCircle,
  FaPlusCircle,
  FaPaperPlane,
  FaExchangeAlt,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/admin", label: "Dashboard", icon: FaTachometerAlt },
    { to: "/admin/books", label: "Books", icon: FaBook },
    { to: "/admin/book-requests", label: "Book Requests", icon: FaPaperPlane },
    { to: "/admin/students", label: "All Students", icon: FaUser },
    { to: "/admin/student-id-card", label: "Student ID Card", icon: FaUserGraduate },
    { to: "/admin/profile", label: "Profile", icon: FaUserCircle },
    { to: "/admin/add-book", label: "Add Book", icon: FaPlusCircle },
    { to: "/admin/add-student", label: "Add Student", icon: FaPlusCircle },
    { to: "/admin/transactions", label: "Recent Transactions", icon: FaExchangeAlt },
  ];

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        links={links}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />

      <div
        className={`flex-1 flex flex-col pt-16 h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-r from-orange-50 via-white to-orange-100 transition-all duration-300 ${
          isCollapsed ? "sm:ml-20" : "sm:ml-56"
        }`}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          toggleCollapse={toggleCollapse}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-6 flex-grow"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
        
      </div>
    </div>
  );
}
