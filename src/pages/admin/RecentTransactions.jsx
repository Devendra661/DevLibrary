import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLibraryStore } from "../../store/useLibrary.js";
import { FaCheckCircle, FaClock, FaTimesCircle, FaBook, FaUserCircle } from "react-icons/fa";

export default function RecentTransactions() {
  const { bookRequests, loadBooks } = useLibraryStore();
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]); // State to hold student data

  useEffect(() => {
    loadBooks(); // This also loads borrowed and book requests
    // Fetch students data
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const studentsData = await res.json();
        setStudents(studentsData);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (bookRequests && students.length > 0) {
      const allTransactions = [];

      // Process book requests (now includes borrowed book fields)
      bookRequests.forEach((req) => {
        const student = students.find(s => s.studentId === req.studentId);
        const requestDate = new Date(req.requestDate || req.date);
        const borrowDate = req.borrowDate ? new Date(req.borrowDate) : null;
        const dueDate = req.dueDate ? new Date(req.dueDate) : null;
        const returnedDate = req.returnedDate ? new Date(req.returnedDate) : null;

        allTransactions.push({
          ...req,
          type: "request", // All records are now 'request' type
          date: requestDate,
          borrowDate,
          dueDate,
          returnedDate,
          studentName: student?.studentName || "Unknown Student",
          studentImage: student?.image || "https://via.placeholder.com/150/FF8C00/FFFFFF?text=User",
        });
      });

      // Sort by date (newest first for recent transactions)
      allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
      setTransactions(allTransactions);
    }
  }, [bookRequests, students]);

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="p-6 bg-white rounded-lg shadow-md"
    >
            {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Recent Transactions
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The secret of getting ahead is getting started.”
        </p>
      </div>
      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Return Status & Date
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    <div className="flex items-center">
                      <img src={record.studentImage} alt={record.studentName} className="w-8 h-8 rounded-full mr-2 object-cover" />
                      <div>
                        <p className="font-semibold">{record.studentName}</p>
                        <p className="text-xs text-gray-500">{record.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.status === "approved" && !record.returnedDate ? (
                      <span className="flex items-center">
                        <FaBook className="mr-1 text-blue-500" /> Borrowed
                      </span>
                    ) : record.status === "returned" ? (
                      <span className="flex items-center">
                        <FaBook className="mr-1 text-green-500" /> Returned
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaBook className="mr-1 text-purple-500" /> Request
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.bookTitle}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {(record.borrowDate || record.date) ? (record.borrowDate || record.date).toLocaleString() : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.dueDate ? record.dueDate.toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.returnedDate
                      ? `Returned on ${record.returnedDate.toLocaleDateString()}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.status === "pending" ? (
                      <span className="flex items-center text-yellow-600 font-semibold">
                        <FaClock className="mr-1" /> Pending
                      </span>
                    ) : record.status === "approved" ? (
                      <span className="flex items-center text-blue-600 font-semibold">
                        <FaBook className="mr-1" /> Borrowed
                      </span>
                    ) : record.status === "returned" ? (
                      <span className="flex items-center text-green-600 font-semibold">
                        <FaCheckCircle className="mr-1" /> Returned
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-semibold">
                        <FaTimesCircle className="mr-1" /> Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
