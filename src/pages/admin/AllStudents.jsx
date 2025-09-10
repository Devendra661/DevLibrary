import StudentTable from "../../components/StudentTable.jsx";
import { motion } from "framer-motion";

export default function AllStudents() {
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="p-6"
    >
            {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          All Students
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “A person who never made a mistake never tried anything new.”
        </p>
      </div>
      <StudentTable />
    </motion.div>
  );
}