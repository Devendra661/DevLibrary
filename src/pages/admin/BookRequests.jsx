import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function BookRequests() {
  const [bookRequests, setBookRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState({}); // Track loading per request

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/book-requests`)
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data.filter(
          (request) => request.status === "pending" || request.status === "approved"
        );
        setBookRequests(filteredData);
      })
      .catch((err) => toast.error("Failed to fetch book requests: " + err.message));
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoadingRequests((prev) => ({ ...prev, [id]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/book-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to approve request");
        return;
      }

      setBookRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: "approved" } : req))
      );
      toast.success("Request approved!");
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingRequests((prev) => ({ ...prev, [id]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/book-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to reject request");
        return;
      }

      setBookRequests((prev) => prev.filter((req) => req._id !== id));
      toast.success("Request rejected!");
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReturn = async (bookId, studentId, requestId) => {
    try {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, studentId }),
      });
      const data = await res.json();

      if (data.message === "Book returned successfully") {
        setBookRequests((prev) =>
          prev.map((req) =>
            req._id === requestId
              ? { ...req, status: "returned", returnedDate: data.book.returnedDate }
              : req
          )
        );
        toast.success("Book returned successfully!");
      } else {
        toast.error(data.message || "Error returning book");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Book Requests
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The journey of a thousand miles begins with a single step.”
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {bookRequests.map((request) => (
          <motion.div
            key={request._id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden p-4 border border-orange-200 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="font-bold text-2xl mb-3 text-gray-800">{request.bookTitle}</div>
              <p className="text-gray-600 text-base mb-2">
                👤 Requested by:{" "}
                <span className="font-semibold text-gray-900">{request.studentName}</span>
              </p>
              <p className="text-gray-500 text-sm mb-4">
                📅 Request Date: {new Date(request.requestDate).toLocaleDateString()}
              </p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white shadow-sm ${
                  request.status === "pending"
                    ? "bg-yellow-500"
                    : request.status === "approved"
                    ? "bg-green-500"
                    : request.status === "rejected"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {request.status}
              </span>
            </div>

            {request.status === "pending" && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApprove(request._id)}
                  disabled={loadingRequests[request._id]}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded-md mr-2 transition-all duration-300"
                >
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReject(request._id)}
                  disabled={loadingRequests[request._id]}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
                >
                  Reject
                </motion.button>
              </div>
            )}

            {request.status === "approved" && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleReturn(request.bookId, request.studentId, request._id)
                  }
                  disabled={loadingRequests[request._id]}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
                >
                  Return Book
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
