import React, { useRef, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import uploadIcon from "../assets/upload_area.svg";

// Generate random password utility
const generateRandomPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const StaffAdd = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    username: "",
    dateOfBirth: "",
    hiringDate: "",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const generatedPassword = generateRandomPassword();

      const payload = {
        ...formData,
        password: generatedPassword, // auto-generated password
      };

      const res = await axios.post("http://localhost:5000/staff/create", payload);

      if (res.status === 201 || res.status === 200) {
        alert(`Staff member added successfully! Password: ${generatedPassword}`);
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          username: "",
          dateOfBirth: "",
          hiringDate: "",
          image: "",
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 409) {
          alert("This email or username is already registered.");
        } else if (error.response.data?.message) {
          alert(error.response.data.message);
        } else {
          alert(`Failed to add staff: ${error.response.statusText}`);
        }
        console.error("Backend error:", error.response.data);
      } else {
        alert("An unexpected error occurred. Please try again.");
        console.error("Error adding staff:", error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Add Staff Member</h1>

        {/* Image Upload */}
        <div className="flex justify-center mb-6">
          <div
            onClick={handleImageClick}
            className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg cursor-pointer overflow-hidden"
          >
            <img
              src={formData.image || uploadIcon}
              alt="Upload"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Phone Number", name: "phoneNumber" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Hiring Date", name: "hiringDate", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block font-semibold text-sm text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="md:col-span-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded"
          >
            Add Staff Member
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default StaffAdd;
