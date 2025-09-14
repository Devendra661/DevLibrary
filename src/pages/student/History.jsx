import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuth.js";
import { useLibraryStore } from "../../store/useLibrary.js";
import { FaCheckCircle, FaClock, FaTimesCircle, FaBook } from "react-icons/fa";

export default function History() {
  const { user } = useAuthStore();
  const { bookRequests, loadBooks, books } = useLibraryStore();
  const [studentHistory, setStudentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPerPage] = useState(15);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (user && bookRequests) {
      // Map book requests (now includes borrowed book fields)
      const userRequests = bookRequests
        .filter((req) => req.studentId === user?.username)
        .map((req) => {
          const requestDate = new Date(req.requestDate || req.date);
          const borrowDate = req.borrowDate ? new Date(req.borrowDate) : null;
          const dueDate = req.dueDate ? new Date(req.dueDate) : null;
          const returnedDate = req.returnedDate ? new Date(req.returnedDate) : null;

          const book = books.find(book => book.bookId === req.bookId); // Find book details
          return {
            ...req,
            bookTitle: book ? book.title : "Unknown Book", // Add bookTitle
            type: "request", // All records are now 'request' type
            date: requestDate,
            borrowDate,
            dueDate,
            returnedDate,
          };
        });

      // All history now comes from bookRequests
      const combinedHistory = userRequests.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      setStudentHistory(combinedHistory);
    }
  }, [user, bookRequests, books]);

  // Pagination logic
  const indexOfLastHistory = currentPage * historyPerPage;
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
  const currentHistory = studentHistory.slice(indexOfFirstHistory, indexOfLastHistory);

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
          Borrowing History
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The more that you read, the more things you will know. The more that you learn, the more places you'll go.”
        </p>
      </div>

      {studentHistory.length === 0 ? (
        <p className="text-gray-600">No history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr No.
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
              {currentHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {record.status === "approved" && !record.returnedDate ? "Borrowed" : record.status === "returned" ? "Returned" : "Request"}
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(studentHistory.length / historyPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(studentHistory.length / historyPerPage)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
