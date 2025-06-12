import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/doctor/patient/${id}`);
        setPatient(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!patient) return <p>Patient not found.</p>;

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Patient Details</h1>
        <div className="mb-4">
          <strong>Name:</strong> {patient.firstName} {patient.lastName}
        </div>
        <div className="mb-4">
          <strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <strong>Gender:</strong> {patient.gender}
        </div>
        {patient.phoneNumber && (
          <div className="mb-4">
            <strong>Phone Number:</strong> {patient.phoneNumber}
          </div>
        )}
        {patient.email && (
          <div className="mb-4">
            <strong>Email:</strong> {patient.email}
          </div>
        )}
        {patient.address && (
          <div className="mb-4">
            <strong>Address:</strong> {patient.address}
          </div>
        )}
        {patient.emergencyContactName && (
          <div className="mb-4">
            <strong>Emergency Contact Name:</strong> {patient.emergencyContactName}
          </div>
        )}
        {patient.emergencyContactPhone && (
          <div className="mb-4">
            <strong>Emergency Contact Phone:</strong> {patient.emergencyContactPhone}
          </div>
        )}
        <div className="mt-6 text-sm text-gray-500">
          <p>Created at: {new Date(patient.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(patient.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default PatientDetails;
