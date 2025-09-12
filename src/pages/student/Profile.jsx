import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuth.js";
import { User, Mail, Phone, MapPin, IdCard } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../../components/Modal.jsx";

export default function Profile() {
  const { user, refreshUser } = useAuthStore();
  const [studentProfileData, setStudentProfileData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    refreshUser();

    const fetchStudentProfile = async () => {
      if (user && user.username && user.role === "student") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/students/${user.username}`
          );
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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/students/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, password: newPassword }),
        }
      );

      if (response.ok) {
        toast.success("Password updated successfully!");
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error("Error updating password: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Student Profile
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The future belongs to those who believe in the beauty of their dreams.”
        </p>
      </div>

      {/* Two card layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-6">
        {/* Left Card: Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden p-4 border border-orange-200 flex flex-col items-center"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg mb-4">
            
          </div>
          <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
            {displayUser?.studentName || "Student"}
          </h1>
          <p className="mt-4 italic text-gray-500 text-sm text-center">
            “The beautiful thing about learning is that no one can take it away from you.”
          </p>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow hover:shadow-[0_0_12px_orangered] transition"
          >
            Update Password
          </button>
        </motion.div>

        {/* Right Card: Details */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-2xl shadow-md overflow-hidden p-4 border border-orange-200 flex flex-col justify-center"
        >
          <div className="space-y-4">
            <ProfileField
              icon={<User className="text-blue-600" />}
              label="Name"
              value={displayUser?.studentName || "N/A"}
            />
            <ProfileField
              icon={<IdCard className="text-purple-600" />}
              label="Student ID"
              value={displayUser?.studentId || "N/A"}
            />
            <ProfileField
              icon={<Mail className="text-green-600" />}
              label="Email"
              value={displayUser?.emailId || "N/A"}
            />
            <ProfileField
              icon={<Phone className="text-pink-600" />}
              label="Mobile"
              value={displayUser?.number || "N/A"}
            />
            <ProfileField
              icon={<MapPin className="text-yellow-600" />}
              label="Address"
              value={displayUser?.address || "N/A"}
            />
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <InputField label="Old Password" name="oldPassword" type="password" />
          <InputField label="New Password" name="newPassword" type="password" />
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
    </div>
  );
}

// Reusable ProfileField component
function ProfileField({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0px 0px 12px rgba(255,69,0,0.3), 0px 0px 20px rgba(255,69,0,0.2)",
      }}
      className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-md transition cursor-pointer"
    >
      <div className="p-2 bg-white rounded-lg shadow">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </motion.div>
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
