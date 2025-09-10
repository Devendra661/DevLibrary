import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import idCardFront from "../../assets/id_card_front.jpg";
import idCardBack from "../../assets/id_card_back.jpg";
import { toast } from 'react-toastify';

export default function IssueIDCard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState(false);
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0]); // Select the first student by default
        }
      } catch (err) {
        toast.error("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (students.length === 0) return <p>No students found. Add students to issue ID cards.</p>;

  

  const studentToDisplay = selectedStudent || students[0]; // Fallback to first student if none selected

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-4rem)] p-6">
            {/* Heading + Quote */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-[0_0_6px_orangered]">
          Issue ID Card
        </h1>
        <p className="mt-1 italic text-gray-600 text-sm">
          “An investment in knowledge pays the best interest.”
        </p>
      </div>

      {/* Student Selection Dropdown */}
      <div className="mb-6 w-full max-w-md">
        <label htmlFor="student-select" className="block text-gray-700 text-sm font-bold mb-2">Select Student:</label>
        <select
          id="student-select"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedStudent ? selectedStudent.studentId : ''}
          onChange={(e) => {
            const foundStudent = students.find(s => s.studentId === e.target.value);
            setSelectedStudent(foundStudent);
          }}
        >
          {students.map(s => (
            <option key={s.studentId} value={s.studentId}>
              {s.studentName} ({s.studentId})
            </option>
          ))}
        </select>
      </div>

      <motion.div
        className="w-[300px] md:w-[350px] lg:w-[400px] h-[550px] md:h-[600px] lg:h-[650px] perspective cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="relative w-full h-full rounded-lg shadow-2xl"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex flex-col justify-start rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${idCardFront})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Top section: Logo */}
            <div className="flex justify-start p-4 items-center gap-2">
              <img src="/logo.png" alt="Library Logo" className="w-10 h-10" />
              <div className="text-white">
                <p className="text-lg font-bold">DevLibrary</p>
                <p className="text-xs">“Discover. Imagine. Achieve.”</p>
              </div>
            </div>

            {/* Middle: Student Image */}
            <div className="flex justify-center mt-4">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-red-500 flex items-center justify-center overflow-hidden bg-gray-200">
                {studentToDisplay.image ? (
                  <img
                    src={studentToDisplay.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Image</span>
                )}
              </div>
            </div>

            {/* Bottom: Info */}
            <div className="mt-4 text-black px-6 flex flex-col gap-5 leading-tight">
              <p className="text-center text-2xl font-bold">{studentToDisplay.studentName}</p>
              <p className="text-base"><FaIdCard className="inline mr-2" />ID No : {studentToDisplay.studentId}</p>
              <p className="text-base"><FaPhone className="inline mr-2" />Phone : {studentToDisplay.number}</p>
              <p className="text-base"><FaEnvelope className="inline mr-2" />E-mail : {studentToDisplay.emailId || "email@example.com"}</p>
              <p className="text-base"><FaMapMarkerAlt className="inline mr-2" />Address : {studentToDisplay.address}</p>
            </div>


          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex flex-col justify-start rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${idCardBack})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Top section: Library Name */}
            <div className="flex flex-col items-center p-4"> {/* Centered */}
              <div className="text-white text-center"> {/* Centered text */}
                <p className="text-2xl font-bold">DevLibrary</p> {/* Increased font size */}
                <p className="text-lg">“Discover. Imagine. Achieve.”</p> {/* Increased font size */}
              </div>
            </div>


            {/* Middle: Guidelines */}
            <div className="px-6 mt-20 flex-1">
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                <li>For library members only.</li>
                <li>Keep card safe and clean.</li>
                <li>Return books on time.</li>
                <li>No card sharing allowed.</li>
                <li>Report loss immediately.</li>
                <li>Follow library rules.</li>
              </ul>
            </div>



            {/* Bottom: Signature and QR code */}
            <div className="flex justify-between items-end px-6  mb-12"> {/* Added px-6 for horizontal padding */}
              {/* Signature */}
              <div className="flex flex-col items-center">
                <img src="/sign.jpg" alt="Signature" className="w-24 h-auto sm:w-32 md:w-40 lg:w-48 object-contain" />
                <p className="text-xs text-gray-700 mt-1">Authorized Signature</p>
              </div>

              {/* QR code */}
              <QRCode
                value={studentToDisplay.studentId || ""}
                size={100}
                level="H"
                className="bg-white p-2 rounded"
              />
            </div>


          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
