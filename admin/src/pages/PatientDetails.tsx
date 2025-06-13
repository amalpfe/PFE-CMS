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

interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  treatment: string;
  prescription: string;
  recordDate: string;
}

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  // Form state
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newPrescription, setNewPrescription] = useState("");
  const [newRecordDate, setNewRecordDate] = useState(new Date().toISOString().slice(0, 10));

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Fetch patient details
  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/doctor/patient/${id}`);
        setPatient(res.data);
        setError(null);
      } catch {
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Fetch medical records
  useEffect(() => {
    if (!id) return;

    const fetchMedicalRecords = async () => {
      try {
        setRecordsLoading(true);
        const res = await axios.get(`http://localhost:5000/doctor/patient/${id}/medical-records`);
        setMedicalRecords(res.data);
        setRecordsError(null);
      } catch {
        setRecordsError("Failed to load medical records.");
      } finally {
        setRecordsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [id]);

  const handleAddMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      setSubmitError("Doctor not logged in.");
      setSubmitLoading(false);
      return;
    }

    if (!patient) {
      setSubmitError("Patient not loaded.");
      setSubmitLoading(false);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/doctor/${doctorId}/medical-record`, {
        patientId: patient.id,
        diagnosis: newDiagnosis,
        treatment: newTreatment,
        prescription: newPrescription,
        recordDate: newRecordDate,
      });

      setSubmitSuccess("Medical record added successfully.");

      // Reset form fields
      setNewDiagnosis("");
      setNewTreatment("");
      setNewPrescription("");
      setNewRecordDate(new Date().toISOString().slice(0, 10));

      // Refresh medical records
      const res = await axios.get(`http://localhost:5000/doctor/patient/${patient.id}/medical-records`);
      setMedicalRecords(res.data);
    } catch {
      setSubmitError("Failed to add medical record.");
    } finally {
      setSubmitLoading(false);
    }
  };

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

        {/* Medical Records Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Medical Records</h2>

          {recordsLoading ? (
            <p>Loading records...</p>
          ) : recordsError ? (
            <p className="text-red-500">{recordsError}</p>
          ) : medicalRecords.length === 0 ? (
            <p className="text-gray-500">No medical records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Diagnosis</th>
                    <th className="px-4 py-2 border">Treatment</th>
                    <th className="px-4 py-2 border">Prescription</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{record.diagnosis}</td>
                      <td className="px-4 py-2 border">{record.treatment}</td>
                      <td className="px-4 py-2 border">{record.prescription}</td>
                      <td className="px-4 py-2 border">
                        {new Date(record.recordDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Medical Record Form */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Add Medical Record</h2>

          {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
          {submitSuccess && <p className="text-green-600 mb-2">{submitSuccess}</p>}

          <form onSubmit={handleAddMedicalRecord}>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="diagnosis">
                Diagnosis *
              </label>
              <input
                id="diagnosis"
                type="text"
                className="w-full border rounded p-2"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="treatment">
                Treatment *
              </label>
              <input
                id="treatment"
                type="text"
                className="w-full border rounded p-2"
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="prescription">
                Prescription
              </label>
              <input
                id="prescription"
                type="text"
                className="w-full border rounded p-2"
                value={newPrescription}
                onChange={(e) => setNewPrescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="recordDate">
                Record Date *
              </label>
              <input
                id="recordDate"
                type="date"
                className="w-full border rounded p-2"
                value={newRecordDate}
                onChange={(e) => setNewRecordDate(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitLoading ? "Adding..." : "Add Record"}
            </button>
          </form>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default PatientDetails;
