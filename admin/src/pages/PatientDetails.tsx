import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorLayout from "../components/DoctorLayout";
import axios from "axios";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
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

  const [viewedRecord, setViewedRecord] = useState<MedicalRecord | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
    attachment: "",
  });

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
    const res = await axios.get(
      `http://localhost:5000/doctor/patient/${doctorId}/patient/${id}/medical-records`
    );
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

  const openViewModal = (record: MedicalRecord) => {
    setViewedRecord(record);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setViewedRecord(null);
    setShowViewModal(false);
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() || "";
      setNewRecord((prev) => ({ ...prev, attachment: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddRecord = async () => {
    if (!id || !doctorId) return;

    try {
      const res = await axios.post(`http://localhost:5000/doctor/patient/${id}/add-record`, {
        ...newRecord,
        patientId: id,
        doctorId,
        recordDate: new Date().toISOString(),
      });

      setMedicalRecords((prev) => [...prev, res.data]);
      setShowAddModal(false);
      setNewRecord({
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
        attachment: "",
      });
    } catch (err) {
      alert("Failed to add medical record.");
    }
  };

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!patient) return <p>Patient not found.</p>;

  return (
    <DoctorLayout>
      <div className="max-w-8xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Patient Details</h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
          {patient.image && (
            <img
              src={patient.image}
              alt={`${patient.firstName} ${patient.lastName}`}
              className="w-32 h-32 rounded-full object-cover col-span-1 md:col-span-2 mx-auto"
            />
          )}
          <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          {patient.weight && <p><strong>Weight:</strong> {patient.weight} kg</p>}
          {patient.height && <p><strong>Height:</strong> {patient.height} cm</p>}
          {patient.bloodGroup && <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>}
          {patient.maritalStatus && <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>}
          {patient.hadSurgery !== null && <p><strong>Had Surgery:</strong> {patient.hadSurgery ? "Yes" : "No"}</p>}
          {patient.chronicDiseases && <p><strong>Chronic Diseases:</strong> {patient.chronicDiseases}</p>}
          {patient.geneticDiseases && <p><strong>Genetic Diseases:</strong> {patient.geneticDiseases}</p>}
          {patient.allergy && <p><strong>Allergy:</strong> {patient.allergy}</p>}
        </div>

        {/* Medical Records */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-purple-800">Medical Records</h2>
            <button
              onClick={openAddModal}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md"
            >
              + Add Record
            </button>
          </div>

          {recordsLoading ? (
            <p>Loading records...</p>
          ) : recordsError ? (
            <p className="text-red-500">{recordsError}</p>
          ) : medicalRecords.length === 0 ? (
            <p className="text-gray-500">No medical records found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Diagnosis</th>
                    <th className="px-4 py-2 text-left">Treatment</th>
                    <th className="px-4 py-2 text-left">Prescription</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Action</th>
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
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openViewModal(record)}
                          className="text-purple-600 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Modal */}
        {showViewModal && viewedRecord && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={closeViewModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-8 z-10">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Medical Record Details</h2>
              <p><strong>Diagnosis:</strong> {viewedRecord.diagnosis}</p>
              <p><strong>Treatment:</strong> {viewedRecord.treatment}</p>
              <p><strong>Prescription:</strong> {viewedRecord.prescription}</p>
              <p><strong>Date:</strong> {new Date(viewedRecord.recordDate).toLocaleDateString()}</p>
              {viewedRecord.notes && <p><strong>Notes:</strong> {viewedRecord.notes}</p>}
              {viewedRecord.attachment && (
                <div className="mt-4">
                  <p className="font-semibold">Attachment:</p>
                  {viewedRecord.attachment.includes("pdf") ? (
                    <a
                      href={viewedRecord.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    <img
                      src={viewedRecord.attachment}
                      alt="Attachment"
                      className="max-w-full max-h-96 rounded-md mt-2"
                    />
                  )}
                </div>
              )}
              <button
                onClick={closeViewModal}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={closeAddModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 p-8 z-10">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Add Medical Record</h2>
              <div className="grid gap-4">
                <input
                  placeholder="Diagnosis"
                  className="border p-2 rounded"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                />
                <input
                  placeholder="Treatment"
                  className="border p-2 rounded"
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                />
                <input
                  placeholder="Prescription"
                  className="border p-2 rounded"
                  value={newRecord.prescription}
                  onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
                />
                <textarea
                  placeholder="Notes (optional)"
                  className="border p-2 rounded"
                  rows={3}
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                />
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="border p-2 rounded"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleAddRecord}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
                >
                  Submit
                </button>
                <button
                  onClick={closeAddModal}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default PatientDetails;
