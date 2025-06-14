import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  weight?: number | null;
  height?: number | null;
  geneticDiseases?: string;
  chronicDiseases?: string;
  allergy?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  hadSurgery?: boolean | null;
  image?: string;
}

interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  treatment: string;
  prescription: string;
  recordDate: string;
  notes?: string;
  attachment?: string;
}

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newPrescription, setNewPrescription] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newAttachment, setNewAttachment] = useState<string | null>(null);
  const [newRecordDate, setNewRecordDate] = useState(new Date().toISOString().slice(0, 10));

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    if (!doctorId) {
      navigate("/doctor/login");
      return;
    }

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

    fetchPatient();
    fetchMedicalRecords();
  }, [id, doctorId, navigate]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setNewAttachment(base64);
      } catch {
        setSubmitError("Failed to upload attachment.");
      }
    }
  };

  const handleAddMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

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
        notes: newNotes,
        attachment: newAttachment,
        recordDate: newRecordDate,
      });

      setSubmitSuccess("Medical record added successfully.");
      setNewDiagnosis("");
      setNewTreatment("");
      setNewPrescription("");
      setNewNotes("");
      setNewAttachment(null);
      setNewRecordDate(new Date().toISOString().slice(0, 10));

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
          {patient.image && (
            <img
              src={patient.image}
              alt={`${patient.firstName} ${patient.lastName}`}
              className="w-32 h-32 rounded-full object-cover col-span-1 md:col-span-2 mx-auto mb-4"
            />
          )}

          <p><span className="font-semibold">Name:</span> {patient.firstName} {patient.lastName}</p>
          <p><span className="font-semibold">Date of Birth:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          <p><span className="font-semibold">Gender:</span> {patient.gender}</p>
          {patient.weight !== null && patient.weight !== undefined && (
            <p><span className="font-semibold">Weight:</span> {patient.weight} kg</p>
          )}
          {patient.height !== null && patient.height !== undefined && (
            <p><span className="font-semibold">Height:</span> {patient.height} cm</p>
          )}
          {patient.geneticDiseases && <p><span className="font-semibold">Genetic Diseases:</span> {patient.geneticDiseases}</p>}
          {patient.chronicDiseases && <p><span className="font-semibold">Chronic Diseases:</span> {patient.chronicDiseases}</p>}
          {patient.allergy && <p><span className="font-semibold">Allergy:</span> {patient.allergy}</p>}
          {patient.bloodGroup && <p><span className="font-semibold">Blood Group:</span> {patient.bloodGroup}</p>}
          {patient.maritalStatus && <p><span className="font-semibold">Marital Status:</span> {patient.maritalStatus}</p>}
          {patient.hadSurgery !== null && patient.hadSurgery !== undefined && (
            <p><span className="font-semibold">Had Surgery:</span> {patient.hadSurgery ? "Yes" : "No"}</p>
          )}
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

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">Medical Records</h2>
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

        <div>
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">Add Medical Record</h2>
          {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
          {submitSuccess && <p className="text-green-600 mb-2">{submitSuccess}</p>}

          <form onSubmit={handleAddMedicalRecord} className="space-y-6">
            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
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
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">Treatment *</label>
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
              <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
              <input
                id="prescription"
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newPrescription}
                onChange={(e) => setNewPrescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                id="notes"
                className="w-full border border-gray-300 rounded-lg p-2"
                rows={3}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">Attachment (Image, PDF)</label>
              <input
                id="attachment"
                type="file"
                className="block w-full text-sm text-gray-600"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              {newAttachment && (
                <p className="text-sm text-green-600 mt-1">File uploaded successfully.</p>
              )}
            </div>

            <div>
              <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-1">Record Date *</label>
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
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold px-6 py-2 rounded-md"
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
