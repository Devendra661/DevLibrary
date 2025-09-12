import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuth.js";
import { User, Mail, Phone, MapPin, IdCard } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, refreshUser } = useAuthStore();
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
            <img src={displayUser?.image} alt="student" className="w-24 h-24 rounded-full object-cover"/>
          </div>
          <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
            {displayUser?.studentName || "Student"}
          </h1>
          <p className="mt-4 italic text-gray-500 text-sm text-center">
            “The beautiful thing about learning is that no one can take it away from you.”
          </p>
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
              icon={<IdCard className="text-purple-600" />}
              label="Student ID"
              value={displayUser?.studentId}
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
