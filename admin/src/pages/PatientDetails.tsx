import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
  // Inside PatientDetails component
  const navigate = useNavigate();
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

    <div className="max-w-8xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-800">Patient Details</h1>

      {/* Patient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
        <p><span className="font-semibold">Name:</span> {patient.firstName} {patient.lastName}</p>
        <p><span className="font-semibold">Date of Birth:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        <p><span className="font-semibold">Gender:</span> {patient.gender}</p>
        {patient.phoneNumber && <p><span className="font-semibold">Phone:</span> {patient.phoneNumber}</p>}
        {patient.email && <p><span className="font-semibold">Email:</span> {patient.email}</p>}
        {patient.address && <p><span className="font-semibold">Address:</span> {patient.address}</p>}
        {patient.emergencyContactName && <p><span className="font-semibold">Emergency Contact:</span> {patient.emergencyContactName}</p>}
        {patient.emergencyContactPhone && <p><span className="font-semibold">Emergency Phone:</span> {patient.emergencyContactPhone}</p>}
        <p className="col-span-2 text-sm text-gray-500 mt-2">
          Created: {new Date(patient.createdAt).toLocaleString()} <br />
          Updated: {new Date(patient.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* Medical Records */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Medical Records</h2>
        {recordsLoading ? (
          <p>Loading records...</p>
        ) : recordsError ? (
          <p className="text-red-500">{recordsError}</p>
        ) : medicalRecords.length === 0 ? (
          <p className="text-gray-500">No medical records found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Diagnosis</th>
                  <th className="px-4 py-2 text-left">Treatment</th>
                  <th className="px-4 py-2 text-left">Prescription</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record, index) => (
                  <tr key={record.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{record.diagnosis}</td>
                    <td className="px-4 py-2">{record.treatment}</td>
                    <td className="px-4 py-2">{record.prescription}</td>
                    <td className="px-4 py-2">{new Date(record.recordDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Medical Record */}
      <div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Add Medical Record</h2>
        {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
        {submitSuccess && <p className="text-green-600 mb-2">{submitSuccess}</p>}

        <form onSubmit={handleAddMedicalRecord} className="space-y-6">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis *
            </label>
            <input
              id="diagnosis"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
              Treatment *
            </label>
            <input
              id="treatment"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newTreatment}
              onChange={(e) => setNewTreatment(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">
              Prescription
            </label>
            <input
              id="prescription"
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newPrescription}
              onChange={(e) => setNewPrescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-1">
              Record Date *
            </label>
            <input
              id="recordDate"
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newRecordDate}
              onChange={(e) => setNewRecordDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-purple-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-md"
          >
            {submitLoading ? "Adding..." : "Add Record"}
          </button>
        </form>
        <div className="flex justify-end mb-4">
  <button
    onClick={() => navigate(`/doctor/appointments/create?patientId=${patient?.id}`)}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
  >
    Add Appointment
  </button>
</div>

      </div>
    </div>

</DoctorLayout>

  );
};

export default PatientDetails;
