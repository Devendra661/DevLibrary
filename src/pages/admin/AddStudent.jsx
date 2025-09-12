import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StudentForm from '../../components/StudentForm'; // Import StudentForm
import { toast } from 'react-toastify';
import { useLibraryStore } from '../../store/useLibrary.js';

export default function AddStudent() {
  const { addStudent } = useLibraryStore();
  const handleSubmit = async (formData) => { // Accept formData directly
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students`, {
        method: 'POST',
        body: formData, // Send FormData directly
        // No Content-Type header needed for FormData
      });

      if (res.ok) {
        const newStudent = await res.json();
        addStudent(newStudent);
        toast.success('Student added successfully!');
        // StudentForm will handle its own state reset
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to add student.');
      }
    } catch (error) {
      toast.error('An error occurred while adding the student: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Add New Student
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “The beautiful thing about learning is that no one can take it away from you.”
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-[0_0_10px_rgba(255,69,0,0.25)] overflow-hidden"
      >
        {/* Left full image section */}
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/add_student.jpg')", // A student-related image
            minHeight: "400px",
          }}
        ></div>

        {/* Right side form */}
        <div className="p-6 bg-white text-black">
          <StudentForm onSubmit={handleSubmit} />
        </div>
      </motion.div>
    </div>
  );
}