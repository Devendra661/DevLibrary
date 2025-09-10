import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuth.js";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Admin Profile
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The best way to predict the future is to create it.”
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
            <User className="text-white w-14 h-14" />
          </div>
          <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
            {user?.name || "Admin"}
          </h1>
          <p className="text-gray-600 font-medium mt-1">{user?.role}</p>
          <p className="mt-4 italic text-gray-500 text-sm text-center">
            “The best way to predict the future is to create it.”
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
              icon={<User className="text-purple-600" />}
              label="Username"
              value={user?.username}
            />
            <ProfileField
              icon={<Mail className="text-green-600" />}
              label="Email"
              value={user?.email || "N/A"}
            />
            <ProfileField
              icon={<Phone className="text-pink-600" />}
              label="Mobile"
              value={user?.mobile || "N/A"}
            />
            <ProfileField
              icon={<MapPin className="text-yellow-600" />}
              label="Address"
              value={user?.address || "N/A"}
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
