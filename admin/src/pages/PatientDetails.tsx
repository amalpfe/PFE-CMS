import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string | null;
  address: string;
}

interface MedicalRecordFormData {
  diagnosis: string;
  treatment: string;
  prescription: string;
}

interface MedicalRecordFormProps {
  doctorId: number;
  doctorName: string;
}

const MedicalRecordForm = ({ doctorId }: MedicalRecordFormProps) => {
  const { id } = useParams();
  const patientId = Number(id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [errorPatient, setErrorPatient] = useState("");

  const [formData, setFormData] = useState<MedicalRecordFormData>({
    diagnosis: "",
    treatment: "",
    prescription: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Fetch patient info
  useEffect(() => {
    if (!patientId || isNaN(patientId)) {
      setErrorPatient("Invalid patient ID.");
      setLoadingPatient(false);
      return;
    }

    axios
      .get(`http://localhost:5000/doctor/patient/${patientId}`)
      .then((res) => {
        setPatient(res.data);
        setLoadingPatient(false);
      })
      .catch((err) => {
        console.error("Error fetching patient data:", err);
        setErrorPatient("Failed to load patient data.");
        setLoadingPatient(false);
      });
  }, [patientId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const payload = {
      patientId,
      doctorId,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      prescription: formData.prescription,
      recordDate: new Date().toISOString(),
    };

    console.log("Sending medical record payload:", payload);

    axios
      .post("http://localhost:5000/doctor/medical-record", payload)
      .then(() => {
        setSubmitSuccess("Medical record saved successfully.");
        setFormData({ diagnosis: "", treatment: "", prescription: "" });
      })
      .catch((err) => {
        console.error(
          "Error saving medical record:",
          err.response?.data || err.message
        );
        setSubmitError("Failed to save medical record. Please try again.");
      })
      .finally(() => setSubmitting(false));
  };

  if (loadingPatient) {
    return <div className="p-6 text-center">Loading patient info...</div>;
  }

  if (errorPatient) {
    return <div className="p-6 text-center text-red-600">{errorPatient}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add Medical Record
          </h1>
          <Link
            to={`/doctor/patient/${patientId}`}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            ← Back to Patient Details
          </Link>
        </div>

        {patient && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-300">
            <h2 className="font-semibold mb-2 text-gray-700">
              Patient Information
            </h2>
            <p>
              <strong>Name:</strong> {patient.firstName} {patient.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Phone Number:</strong> {patient.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {patient.address || "N/A"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="diagnosis"
              className="block font-medium text-gray-700 mb-1"
            >
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter diagnosis"
            />
          </div>

          <div>
            <label
              htmlFor="treatment"
              className="block font-medium text-gray-700 mb-1"
            >
              Treatment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter treatment plan"
            />
          </div>

          <div>
            <label
              htmlFor="prescription"
              className="block font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Additional notes (optional)"
            />
          </div>

          {submitError && <p className="text-red-600">{submitError}</p>}
          {submitSuccess && <p className="text-green-600">{submitSuccess}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Medical Record"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
