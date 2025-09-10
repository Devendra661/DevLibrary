import { useState } from "react";
import StudentForm from "../../components/StudentForm.jsx";
import { toast } from 'react-toastify';

export default function Students() {
  const [students, setStudents] = useState([]);

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
      <StudentForm onSubmit={handleAddStudent} />
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">All Students</h2>
        <ul className="space-y-2">
          {students.map((s, i) => (
            <li key={i} className="p-2 border rounded">
              {s.name} (ID: {s.studentId}) - {s.mobile}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}