import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorLayout from "../components/DoctorLayout";
const CreateAppointment = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("Scheduled");
  const [notes, setNotes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doctorId = localStorage.getItem("doctorId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !patientId) {
      setSubmitError("Missing doctor or patient ID.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/doctor/appointments", {
        doctorId: parseInt(doctorId),
        patientId: parseInt(patientId),
        appointmentDate,
        appointmentStatus,
        notes,
      });

      setSubmitSuccess("Appointment created successfully.");
      setSubmitError(null);
      // Optionally redirect to appointments list or patient details
      navigate("/doctor/appointments");
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to create appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
    <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">Create Appointment</h1>

      {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
      {submitSuccess && <p className="text-green-600 mb-4">{submitSuccess}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="appointmentDate" className="block mb-1 text-gray-700 font-medium">
            Appointment Date *
          </label>
          <input
            type="datetime-local"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label htmlFor="appointmentStatus" className="block mb-1 text-gray-700 font-medium">
            Status *
          </label>
          <select
            id="appointmentStatus"
            value={appointmentStatus}
            onChange={(e) => setAppointmentStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block mb-1 text-gray-700 font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg w-full"
        >
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </form>
    </div>
    </DoctorLayout>
  );
};

export default CreateAppointment;
