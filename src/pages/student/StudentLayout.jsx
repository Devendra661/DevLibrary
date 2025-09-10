import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import Footer from "../../components/Footer.jsx";

import { FaHome, FaBook, FaUser, FaIdCard, FaHistory } from "react-icons/fa";

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/student", label: "Dashboard", icon: FaHome },
    { to: "/student/books", label: "View Books", icon: FaBook },
    { to: "/student/profile", label: "Profile", icon: FaUser },
    { to: "/student/idcard", label: "My ID Card", icon: FaIdCard },
    { to: "/student/borrowed", label: "Borrowed Books", icon: FaBook }, // New link
    { to: "/student/history", label: "History", icon: FaHistory },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar links={links} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      <div className={`flex-1 flex flex-col pt-16 h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-r from-orange-50 via-white to-orange-100 transition-all duration-300 ${isCollapsed ? 'sm:ml-20' : 'sm:ml-56'}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} toggleCollapse={toggleCollapse} />
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
