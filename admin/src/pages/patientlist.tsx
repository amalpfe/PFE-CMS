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
  const [form, setForm] = useState<Partial<Patient>>({});

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`http://localhost:5000/patient/patients/${id}`);
        setPatients((prev) => prev.filter((p) => p.id !== id));
      } catch {
        alert("Failed to delete patient.");
      }
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

  if (loading) {
    return (
      <Layout>
        <p className="p-6 text-center">Loading patients...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="p-6 text-center text-red-600">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Patient List</h1>

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
              {patients.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 px-4">{p.firstName} {p.lastName}</td>
                  <td className="py-3 px-4">{p.dateOfBirth}</td>
                  <td className="py-3 px-4">{p.gender}</td>
                  <td className="py-3 px-4">{p.phoneNumber}</td>
                  <td className="py-3 px-4">{p.email}</td>
                  <td className="py-3 px-4">{p.address}</td>
                  <td className="py-3 px-4">{p.emergencyContactName} ({p.emergencyContactPhone})</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editingPatient && (
          <div className="bg-gray-100 p-4 rounded shadow-md max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">
              Edit Patient: {editingPatient.firstName} {editingPatient.lastName}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" value={form.firstName || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="lastName" placeholder="Last Name" value={form.lastName || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="dateOfBirth" placeholder="DOB" value={form.dateOfBirth || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="gender" placeholder="Gender" value={form.gender || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="phoneNumber" placeholder="Phone" value={form.phoneNumber || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="email" placeholder="Email" value={form.email || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="address" placeholder="Address" value={form.address || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="emergencyContactName" placeholder="Emergency Name" value={form.emergencyContactName || ""} onChange={handleChange} className="p-2 border rounded" />
              <input name="emergencyContactPhone" placeholder="Emergency Phone" value={form.emergencyContactPhone || ""} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingPatient(null)}
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

export default PatientList;
