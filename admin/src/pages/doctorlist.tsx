import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>({});

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/admin/doctors");
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      try {
        await axios.delete(`http://localhost:5000/admin/doctors/${deleteTarget.id}`);
        setDoctors((prev) => prev.filter((doc) => doc.id !== deleteTarget.id));
        setDeleteTarget(null);
      } catch (err) {
        alert("Failed to delete doctor");
      }
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

  const handleUpdate = async () => {
    if (editingDoctor) {
      try {
        const response = await axios.put(
          `http://localhost:5000/admin/doctors/${editingDoctor.id}`,
          form
        );
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === editingDoctor.id ? response.data : doc))
        );
        setEditingDoctor(null);
      } catch (err) {
        alert("Failed to update doctor");
      }
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.firstName.toLowerCase().includes(term) ||
      doctor.lastName.toLowerCase().includes(term) ||
      doctor.email.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term)
    );
  });

  if (loading)
    return (
      <Layout>
        <p className="p-6 text-center">Loading doctors...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p className="p-6 text-center text-red-600">{error}</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Doctor List</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>

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
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b">
                  <td className="py-3 px-4">
                    <img
                      src={doctor.image || "https://via.placeholder.com/100"}
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
                      onClick={() => setDeleteTarget(doctor)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No matching doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingDoctor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-700">
                Edit Doctor: {editingDoctor.firstName} {editingDoctor.lastName}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {["firstName", "lastName", "specialty", "email", "phoneNumber", "fees"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={form[field as keyof Doctor] || ""}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="p-2 border rounded"
                  />
                ))}
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
          </div>
        )}

        {/* View Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Doctor Profile
              </h2>
              <div className="flex gap-6">
                <img
                  src={selectedDoctor.image || "https://via.placeholder.com/150"}
                  alt={selectedDoctor.firstName}
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                  <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                  <p><strong>Email:</strong> {selectedDoctor.email}</p>
                  <p><strong>Phone:</strong> {selectedDoctor.phoneNumber}</p>
                  <p><strong>Degree:</strong> {selectedDoctor.degree}</p>
                  <p><strong>Fees:</strong> ${selectedDoctor.fees}</p>
                  <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
                  <p><strong>Address:</strong> {selectedDoctor.address}</p>
                  <p><strong>About:</strong> {selectedDoctor.about}</p>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorList;
