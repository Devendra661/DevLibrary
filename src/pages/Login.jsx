// src/pages/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.js";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const usernameRef = useRef(null);

  // Auto-focus username field on page load
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    const user = await login(username, password);
    if (user) {
      toast.success("Login successful!");
      setTimeout(
        () => navigate(user.role === "librarian" ? "/admin" : "/student"),
        1000
      );
    } else {
      toast.error("Invalid username or password.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo and Welcome Message */}
        <motion.div
          className="flex flex-col items-center mb-6 md:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="/logo.png"
            alt="DevLibrary Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Welcome to DevLibrary
          </h1>
          <p className="text-gray-500 text-center mt-1 sm:mt-2 italic text-sm sm:text-base md:text-lg">
            "The more that you read, the more things you will know. – Dr. Seuss"
          </p>
        </motion.div>

        {/* Demo credentials */}
        <motion.div
          className="text-center text-sm text-gray-600 mb-3 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>
            <strong>Demo:</strong> Username: <code>DLSTU2</code> | Password:{" "}
            <code>virat1234</code>
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-5xl
                     border-2 border-transparent
                     hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-400/40
                     transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.01]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Left side GIF */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-0">
            <img
              src="/login.avif"
              alt="Library"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
              Login
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleLogin();
              }}
              className="flex flex-col"
            >
              <input
                ref={usernameRef}
                className="input w-full mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg border-2 border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                enterKeyHint="next"
              />

              <input
                type="password"
                className="input w-full mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg border-2 border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                enterKeyHint="go"
              />

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0px 8px 15px rgba(59,130,246,0.4), inset 0px -3px 0px rgba(255,255,255,0.3)",
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                  boxShadow:
                    "0px 4px 8px rgba(59,130,246,0.3), inset 0px 3px 3px rgba(255,255,255,0.2)",
                  y: 2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full p-3 sm:p-4 text-base sm:text-lg md:text-lg font-semibold rounded-lg
                           bg-gradient-to-r from-blue-500 to-blue-600 text-white
                           shadow-md hover:shadow-blue-400/50
                           transform perspective-1000
                           transition-all duration-300"
              >
                Login
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
