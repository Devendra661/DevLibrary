import { useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "../../components/StatsCard.jsx";
import { useAuthStore } from "../../store/useAuth.js";
import { useLibraryStore } from "../../store/useLibrary.js";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { loadBooks, bookRequests } = useLibraryStore();

  useEffect(() => {
    loadBooks();
  }, []);

  const studentBookRequests = bookRequests.filter(req => req.studentId === user?.username);

  const borrowedBooks = studentBookRequests.filter(req => req.status === 'approved' && !req.returnedDate);
  const overdueBooks = borrowedBooks.filter(req => new Date(req.dueDate) < new Date());
  const returnedBooks = studentBookRequests.filter(req => req.status === 'returned');

  const pendingRequests = studentBookRequests.filter(req => req.status === "pending");
  const acceptedRequests = studentBookRequests.filter(req => req.status === "approved");
  const rejectedRequests = studentBookRequests.filter(req => req.status === "rejected");


  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Dashboard
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The expert in anything was once a beginner.”
        </p>
      </div>
      {/* Stats Section */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Total Books Borrowed"
            value={borrowedBooks.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-blue-600"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Currently Borrowed"
            value={borrowedBooks.length - overdueBooks.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-green-600"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Overdue Books"
            value={overdueBooks.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-red-600"
          />
        </motion.div>

        {/* New Cards for Book Request Status */}
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Pending Requests"
            value={pendingRequests.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-yellow-600"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Accepted Requests"
            value={acceptedRequests.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-green-600"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Rejected Requests"
            value={rejectedRequests.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-red-600"
          />
        </motion.div>

        {/* New Card for Returned Books */}
        <motion.div variants={cardVariants}>
          <StatsCard
            title="Returned Books"
            value={returnedBooks.length}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200"
            color="text-purple-600"
          />
        </motion.div>
      </div>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="p-6 mt-6"
      >
        <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
              Welcome, {user?.name}!
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Here’s an overview of your library activity. Check borrowed books, overdue books, and explore new books available.
            </p>
          </div>
          <img
            src="/logo.png"
            alt="DevLibrary Logo"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
