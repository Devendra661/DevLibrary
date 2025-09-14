import { useState, useRef } from "react";
import QRCode from "react-qr-code"; // ✅ updated library
import { motion } from "framer-motion";
import { toast } from 'react-toastify';

export default function StudentForm({ onSubmit, student }) {
  const [studentId, setStudentId] = useState(student ? student.studentId : "");
  const [name, setName] = useState(student ? student.studentName : "");
  const [mobile, setMobile] = useState(student ? student.number : "");
  const [address, setAddress] = useState(student ? student.address : "");
  const [emailId, setEmailId] = useState(student ? student.emailId : "");
  const [password, setPassword] = useState(""); // Don't pre-fill password
  const [profilePic, setProfilePic] = useState(student ? student.image : null);
  const [flipped, setFlipped] = useState(false);

  const fileInputRef = useRef(null); // Declare fileInputRef here

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('studentName', name);
    formData.append('number', mobile);
    formData.append('address', address);
    formData.append('emailId', emailId);
    formData.append('password', password);

    if (profilePic) {
      // Convert Data URL to Blob/File and append
      // profilePic is a Data URL (base64 string)
      // Need to convert it to a Blob or File object
      fetch(profilePic)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'profile.png', { type: blob.type });
          formData.append('image', file);
          onSubmit(formData); // Call onSubmit with FormData
          // Reset form fields
          setStudentId("");
          setName("");
          setMobile("");
          setAddress("");
          setEmailId("");
          setPassword("");
          setProfilePic(null);
        })
        .catch(error => toast.error("Error converting profile photo!"));
    } else {
      onSubmit(formData); // Call onSubmit with FormData even if no image
      // Reset form fields
      setStudentId("");
      setName("");
      setMobile("");
      setAddress("");
      setEmailId("");
      setPassword("");
      setProfilePic(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-semibold text-black">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-black">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-black">Mobile Number</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-black">Address</label>
          <textarea
            id="address"
            name="address"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="emailId" className="block text-sm font-semibold text-black">Email ID</label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-black">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Profile Photo Upload */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-1.5 rounded-md font-bold text-white 
               bg-blue-500 
               shadow-[0_0_8px_deepskyblue,0_0_12px_deepskyblue,0_0_20px_deepskyblue] 
               hover:bg-blue-600 
               hover:shadow-[0_0_12px_deepskyblue,0_0_18px_deepskyblue,0_0_25px_deepskyblue] 
               transition-all text-xs"
        >
          ✨ Upload Photo
        </button>

        {/* Preview selected image */}
        {profilePic && (
          <div className="mt-2 flex justify-center">
            <img
              src={profilePic}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full object-cover border border-blue-400 shadow-[0_0_10px_deepskyblue]"
            />
          </div>
        )}
      </div>


      <button
        type="submit"
        className="w-full py-2.5 px-4 rounded-md font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_8px_orangered] transition-transform transform hover:scale-105 text-sm"
      >
        {student ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
}