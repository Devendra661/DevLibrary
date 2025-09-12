// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuth.js";

export default function Sidebar({ links, isOpen, toggleSidebar, isCollapsed }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 640) toggleSidebar();
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen bg-gray-100 shadow-lg flex flex-col justify-between p-4 transition-all duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} ${
        isCollapsed ? "sm:w-20" : "sm:w-56"
      } sm:translate-x-0`}
    >
      {/* Mobile close (X) */}
      <div className="flex justify-end sm:hidden mb-2">
        <motion.button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 shadow-md"
          whileHover={{
            scale: 1.2,
            rotate: 45,
            boxShadow:
              "0px 8px 15px rgba(0,0,0,0.3), inset 0px 2px 5px rgba(255,255,255,0.4)",
          }}
          whileTap={{
            scale: 0.95,
            boxShadow:
              "0px 4px 8px rgba(0,0,0,0.2), inset 0px 1px 3px rgba(255,255,255,0.3)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          ✕
        </motion.button>
      </div>

      {/* User info */}
      <div>
        {user && (
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-center gap-2"
            } px-3 py-2 bg-orange-600 text-white rounded-lg font-medium mb-4`}
          >
            {user.image && (
              <img
                src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${user.image}`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            )}
            {!isCollapsed && (
              <span>
                Hi,{" "}
                {user.role === "student"
                  ? user.studentName
                  : user.name || user.username}
              </span>
            )}
          </div>
        )}

        {/* Nav Links */}
        <ul className="flex flex-col gap-3 overflow-auto max-h-[calc(100vh-120px)]">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={handleLinkClick}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "hover:bg-orange-500 hover:text-white text-gray-700"
                  }`}
                >
                  <span className="text-lg">
                    {link.icon && <link.icon />}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout */}
      {user && (
        <button
          onClick={logout}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          } p-3 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-300 w-full mt-4`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      )}
    </div>
  );
}
