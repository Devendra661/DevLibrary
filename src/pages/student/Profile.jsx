import { useAuthStore } from "../../store/useAuth.js";
import { useLibraryStore } from "../../store/useLibrary.js";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Modal from "../../components/Modal.jsx";
import { FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, refreshUser } = useAuthStore();
  const { bookRequests, books, returnBook, loadBookRequests } = useLibraryStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentProfileData, setStudentProfileData] = useState(null);

  useEffect(() => {
    refreshUser();

    const fetchStudentProfile = async () => {
      if (user && user.username && user.role === "student") {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/students/${user.username}`);
          if (response.ok) {
            const data = await response.json();
            setStudentProfileData(data);
          } else {
            toast.error("Failed to fetch student profile: " + response.statusText);
          }
        } catch (error) {
          toast.error("Error fetching student profile: " + error.message);
        }
      }
    };
    fetchStudentProfile();
  }, [user, refreshUser]);

  const displayUser = studentProfileData || user;

  const borrowedBooks = bookRequests.filter(
    (req) =>
      req.studentId === displayUser?.studentId &&
      req.status === "approved" &&
      !req.returnedDate
  );

  const getBookDetails = (bookId) => books.find((book) => book.bookId === bookId);

  const handleReturnBook = async (bookId) => {
    try {
      await returnBook(bookId, user.username);
      toast.success("Book returned successfully!");
      loadBookRequests();
    } catch (error) {
      toast.error("Failed to return book: " + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8"
    >
      {/* Heading + Quote */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-600 drop-shadow-[0_0_8px_orangered]">
          My Profile
        </h1>
        <p className="mt-2 italic text-gray-600 text-sm">
          “The future belongs to those who believe in the beauty of their dreams.”
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-8 rounded-2xl shadow-lg md:w-1/3 text-center border border-orange-100 flex flex-col items-center"
        >
          <img
            src={
              displayUser?.image ||
              "https://placehold.co/150x150/FF8C00/FFFFFF?text=User"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-orange-500 shadow-md mx-auto"
          />
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            {displayUser?.studentName}
          </h3>

          <div className="space-y-4 text-gray-700 text-left w-full">
            <ProfileDetail icon={<FaIdCard />} label="Student ID" value={displayUser?.studentId} />
            <ProfileDetail icon={<FaEnvelope />} label="Email" value={displayUser?.emailId} />
            <ProfileDetail icon={<FaPhone />} label="Mobile" value={displayUser?.number} />
            <ProfileDetail icon={<FaMapMarkerAlt />} label="Address" value={displayUser?.address} />
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 w-full">
            <p className="text-lg font-medium text-gray-700">
              Borrowed Books:{" "}
              <span className="font-bold text-orange-600">
                {borrowedBooks.length}
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow hover:shadow-[0_0_12px_orangered] transition"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Borrowed Books */}
        <motion.div className="bg-white p-8 rounded-2xl shadow-lg flex-1 border border-orange-100">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Currently Borrowed
          </h3>
          {borrowedBooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {borrowedBooks.map((borrow) => {
                const book = getBookDetails(borrow.bookId);
                return (
                  <motion.div
                    key={borrow.bookId}
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0px 0px 12px rgba(255,69,0,0.5), 0px 0px 20px rgba(255,140,0,0.3)",
                    }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-xl shadow border border-orange-200"
                  >
                    <img
                      src={book?.coverImageUrl}
                      alt={book?.title}
                      className="w-16 h-24 object-cover rounded-lg shadow"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{book?.title}</p>
                      <p className="text-sm text-gray-600">by {book?.author}</p>
                      <p className="text-xs text-gray-500">
                        Due:{" "}
                        <span className="font-medium text-red-500">
                          {new Date(borrow.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleReturnBook(borrow.bookId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 hover:shadow-[0_0_10px_green] transition text-sm"
                    >
                      Return
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No books currently borrowed.</p>
          )}
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form className="space-y-4">
          <InputField label="Mobile Number" name="mobile" type="text" />
          <InputField label="Old Password" name="oldPassword" type="password" />
          <InputField label="New Password" name="password" type="password" />
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow hover:shadow-[0_0_10px_orangered]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

// Reusable profile detail row
function ProfileDetail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-orange-500 text-lg">{icon}</span>
      <p>
        <span className="font-semibold">{label}:</span>{" "}
        <span className="text-gray-700">{value || "N/A"}</span>
      </p>
    </div>
  );
}

// Reusable input field
function InputField({ label, name, type }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}:
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
