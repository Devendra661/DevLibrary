import { motion } from "framer-motion";

export default function StatsCard({ title, value, Icon, color = "text-gray-800", className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`flex items-center p-6 rounded-xl shadow-lg backdrop-blur-md bg-white/80 transition-all duration-300 ${className}`}
    >
      {/* Icon */}
      {Icon && (
        <div className={`p-4 rounded-full bg-gray-100 mr-4 text-2xl ${color}`}>
          <Icon />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{title}</span>
        <span className={`text-2xl font-bold ${color} mt-1`}>{value}</span>

        {/* Optional mini progress bar for visual effect */}
        {title === "Currently Borrowed" && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${color}`}
              style={{ width: `${Math.min(value * 10, 100)}%` }}
            ></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
