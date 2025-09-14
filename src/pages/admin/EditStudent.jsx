import React from 'react';
import { motion } from 'framer-motion';
import StudentForm from '../../components/StudentForm';
import { toast } from 'react-toastify';
import { useLibraryStore } from '../../store/useLibrary.js';

export default function EditStudent({ student, onClose }) {
  const { updateStudent } = useLibraryStore();

  const handleSubmit = async (formData) => {
    try {
      await updateStudent(student.studentId, formData);
      toast.success('Student updated successfully!');
      onClose();
    } catch (error) {
      toast.error('An error occurred while updating the student: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Edit Student
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-[0_0_10px_rgba(255,69,0,0.25)] overflow-hidden"
      >
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/add_student.jpg')",
            minHeight: "400px",
          }}
        ></div>

        <div className="p-6 bg-white text-black">
          <StudentForm onSubmit={handleSubmit} student={student} />
        </div>
      </motion.div>
    </div>
  );
}
