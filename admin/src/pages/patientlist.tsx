import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
  updatedAt: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<Partial<Patient>>({});
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/patient/patients");
        setPatients(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/patient/patients/${patientToDelete.id}`);
      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete.id));
      setPatientToDelete(null);
    } catch {
      alert("Failed to delete patient.");
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setForm(patient);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (editingPatient) {
      try {
        const response = await axios.put(
          `http://localhost:5000/patient/patients/${editingPatient.id}`,
          form
        );
        setPatients((prev) =>
          prev.map((p) => (p.id === editingPatient.id ? response.data : p))
        );
        setEditingPatient(null);
      } catch {
        alert("Failed to update patient.");
      }
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 relative">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Patient List</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">DOB</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Emergency Contact</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 px-4">{p.firstName} {p.lastName}</td>
                  <td className="py-3 px-4">{p.dateOfBirth}</td>
                  <td className="py-3 px-4">{p.gender}</td>
                  <td className="py-3 px-4">{p.phoneNumber}</td>
                  <td className="py-3 px-4">{p.email}</td>
                  <td className="py-3 px-4">{p.address}</td>
                  <td className="py-3 px-4">{p.emergencyContactName} ({p.emergencyContactPhone})</td>
                  <td className="py-3 px-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setViewingPatient(p)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setPatientToDelete(p)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No matching patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ... Edit Modal, View Modal, Delete Modal (unchanged) */}
        {/* Same modals as in your original code */}
        {/* Keeping them as-is since they're already implemented correctly */}

        {editingPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-4">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700">
                Edit Patient: {editingPatient.firstName} {editingPatient.lastName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName", "dateOfBirth", "gender", "phoneNumber", "email", "address", "emergencyContactName", "emergencyContactPhone"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={(form as any)[field] || ""}
                    onChange={handleChange}
                    className="p-3 border rounded"
                  />
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingPatient(null)}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-4">
              <h2 className="text-2xl font-semibold mb-6 text-purple-700">
                Patient Profile: {viewingPatient.firstName} {viewingPatient.lastName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><strong>First Name:</strong> {viewingPatient.firstName}</p>
                <p><strong>Last Name:</strong> {viewingPatient.lastName}</p>
                <p><strong>Date of Birth:</strong> {viewingPatient.dateOfBirth}</p>
                <p><strong>Gender:</strong> {viewingPatient.gender}</p>
                <p><strong>Phone:</strong> {viewingPatient.phoneNumber}</p>
                <p><strong>Email:</strong> {viewingPatient.email}</p>
                <p><strong>Address:</strong> {viewingPatient.address}</p>
                <p><strong>Emergency Contact:</strong> {viewingPatient.emergencyContactName} ({viewingPatient.emergencyContactPhone})</p>
                <p><strong>Created At:</strong> {new Date(viewingPatient.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(viewingPatient.updatedAt).toLocaleString()}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingPatient(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {patientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete patient{" "}
                <strong>
                  {patientToDelete.firstName} {patientToDelete.lastName}
                </strong>
                ?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setPatientToDelete(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientList;
