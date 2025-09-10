import { motion } from "framer-motion";
import StatsCard from "../../components/StatsCard.jsx";
import { useLibraryStore } from "../../store/useLibrary.js";
import { useEffect, useState } from "react";
import { FaBook, FaUser, FaCalendarDay, FaExclamationTriangle, FaExchangeAlt, FaClipboardList } from "react-icons/fa"; // Import icons

export default function AdminDashboard() {
  const { books, bookRequests: allBookRequests, loadBooks } = useLibraryStore();
  const [totalStudents, setTotalStudents] = useState(0);
  const [bookRequests, setBookRequests] = useState(0);
  const [borrowedToday, setBorrowedToday] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);

  useEffect(() => {
    loadBooks(); // This loads all books and all book requests into the store
    fetch("/api/students")
      .then(res => res.json())
      .then(data => setTotalStudents(data.length));
  }, []);

  useEffect(() => {
    if (allBookRequests) {
      setBookRequests(allBookRequests.filter(r => r.status === 'pending').length);

      const approvedAndNotReturned = allBookRequests.filter(req =>
        req.status === 'approved' && !req.returnedDate
      );

      const today = new Date().toDateString();

      const borrowedTodayCount = approvedAndNotReturned.filter(req =>
        new Date(req.borrowDate).toDateString() === today
      ).length;

      const overdueBooksCount = approvedAndNotReturned.filter(req =>
        new Date(req.dueDate) < new Date()
      ).length;

      setBorrowedToday(borrowedTodayCount);
      setOverdueBooks(overdueBooksCount);
      setTotalBorrowed(approvedAndNotReturned.length);
    }
  }, [allBookRequests]);

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
      className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Heading + Quote */}
      <div className="text-center mb-6 col-span-full">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Admin Dashboard
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The only way to do great work is to love what you do.”
        </p>
      </div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Total Books" value={books.length} Icon={FaBook} color="text-blue-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Total Students" value={totalStudents} Icon={FaUser} color="text-green-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Borrowed Today" value={borrowedToday} Icon={FaCalendarDay} color="text-purple-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Overdue Books" value={overdueBooks} Icon={FaExclamationTriangle} color="text-red-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Total Borrowed" value={totalBorrowed} Icon={FaExchangeAlt} color="text-orange-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
      <motion.div variants={cardVariants}>
        <StatsCard title="Book Requests" value={bookRequests} Icon={FaClipboardList} color="text-yellow-600" className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden flex gap-4 p-4 border border-orange-200" />
      </motion.div>
    </motion.div>
  );
}

