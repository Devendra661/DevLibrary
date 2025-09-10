// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Navbar({ toggleSidebar, isSidebarOpen, toggleCollapse }) {
  return (
    <nav className="bg-orange-500 text-white px-4 py-3 shadow-md flex items-center justify-between fixed top-0 w-full z-50 transition-all duration-300">
      {/* Left: Mobile Hamburger */}
      <motion.button
        onClick={toggleSidebar}
        className="sm:hidden w-11 h-11 flex items-center justify-center text-white"
        whileHover={{
          scale: 1.1,
          rotate: isSidebarOpen ? 0 : 10,
        }}
        whileTap={{
          scale: 0.95,
          rotate: 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        {isSidebarOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <FiMenu className="text-2xl" />
        )}
      </motion.button>

      {/* Left: Desktop Collapse */}
      <motion.button
        onClick={toggleCollapse}
        className="hidden sm:flex w-11 h-11 items-center justify-center text-white"
        whileHover={{
          scale: 1.1,
          rotate: 10,
        }}
        whileTap={{
          scale: 0.95,
          rotate: 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <FiMenu className="text-2xl" />
      </motion.button>

      {/* Center: Brand / Logo */}
      <div className="flex-1 flex items-center justify-center select-none">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="DevLibrary Logo"
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-lg sm:text-xl tracking-wide group-hover:text-yellow-200 transition-colors">
            DevLibrary Admin
          </span>
        </Link>
      </div>

      
    </nav>
  );
}
