import StudentForm from "../../components/StudentForm.jsx";
import { toast } from 'react-toastify';

export default function StudentFormPage() {
  const handleAddStudent = (student) => {
    toast.success("Student submitted successfully!");
  };

  return (
    <div className="p-6">
      {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Student Form
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          "Live as if you were to die tomorrow. Learn as if you were to live forever."
        </p>
      </div>
      <StudentForm onSubmit={handleAddStudent} />
    </div>
  );
}
