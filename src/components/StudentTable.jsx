import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <div className="text-center py-4">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error.message}</div>;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/students/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setStudents(students.filter(student => student._id !== id));
        // Optionally, show a success message
        // toast.success("Student deleted successfully!");
      } catch (err) {
        setError(err);
        // Optionally, show an error message
        // toast.error("Failed to delete student: " + err.message);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="p-6 bg-white rounded-lg shadow-md mt-8"
    >
      {/* <h3 className="text-2xl font-bold text-gray-800 mb-4">All Students</h3> */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredStudents.length === 0 ? (
        <p className="text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr No.
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Password
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {student.emailId}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {student.number}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    {student.address}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text.gray-900">
                    {student.password}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Delete
                    </button>
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
