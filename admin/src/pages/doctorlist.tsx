import React, { useState } from "react";
import Layout from "../components/Layout";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phoneNumber: string;
  email: string;
  address: string;
  degree: string;
  fees: string;
  experience: string;
  about: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Williams",
      specialty: "Dermatologist",
      phoneNumber: "123-456-7890",
      email: "sarah@example.com",
      address: "123 Skin St.",
      degree: "MD",
      fees: "100",
      experience: "5 years",
      about: "Expert in skin treatments.",
      image: "https://via.placeholder.com/100",
      createdAt: "2025-05-19",
      updatedAt: "2025-05-19",
    },
    {
      id: "2",
      firstName: "John",
      lastName: "Doe",
      specialty: "Cardiologist",
      phoneNumber: "987-654-3210",
      email: "john@example.com",
      address: "456 Heart Ave.",
      degree: "MBBS",
      fees: "150",
      experience: "10 years",
      about: "Specializes in heart health.",
      image: "https://via.placeholder.com/100",
      createdAt: "2025-05-18",
      updatedAt: "2025-05-18",
    },
  ]);

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>({});

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (confirmDelete) {
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setForm(doctor);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (editingDoctor) {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.id === editingDoctor.id
            ? { ...doc, ...form, updatedAt: new Date().toISOString() }
            : doc
        )
      );
      setEditingDoctor(null);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Doctor List</h1>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Specialty</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Fees</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b">
                  <td className="py-3 px-4">
                    <img
                      src={doctor.image}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {doctor.firstName} {doctor.lastName}
                  </td>
                  <td className="py-3 px-4">{doctor.specialty}</td>
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4">{doctor.phoneNumber}</td>
                  <td className="py-3 px-4">${doctor.fees}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editingDoctor && (
          <div className="bg-gray-100 p-4 rounded shadow-md max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">
              Edit Doctor: {editingDoctor.firstName} {editingDoctor.lastName}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="specialty"
                value={form.specialty || ""}
                onChange={handleChange}
                placeholder="Specialty"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="fees"
                value={form.fees || ""}
                onChange={handleChange}
                placeholder="Fees"
                className="p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingDoctor(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorList;
