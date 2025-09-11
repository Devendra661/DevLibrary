import { useState, useEffect } from "react";
import StudentForm from "../../components/StudentForm.jsx";
import { toast } from "react-toastify";

export default function Students() {
  const [students, setStudents] = useState([]);

  // Fetch existing students from backend on mount
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://devlibrary-3.onrender.com/api";

    fetch(`${apiUrl}/students`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => setStudents(data))
      .catch(err => {
        console.error("Error fetching students:", err);
        toast.error("Failed to load students from server");
      });
  }, []);

  // Add new student locally after submission
  const handleAddStudent = (student) => {
    setStudents([...students, student]);
    toast.success("Student added and ID card issued!");
  };

  return (
    <div className="p-6">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Manage Students
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “Education is the most powerful weapon which you can use to change the world.”
        </p>
      </div>

      {/* Student Form */}
      <StudentForm onSubmit={handleAddStudent} />

      {/* Student List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">All Students</h2>
        <ul className="space-y-2">
          {students.map((s, i) => (
            <li key={i} className="p-2 border rounded">
              {s.studentName} (ID: {s.studentId}) - {s.number || s.mobile || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
