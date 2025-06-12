import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import DoctorLayout from "../components/DoctorLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

type Appointment = {
  id: number;
  patient: string;
  payment?: string;
  age: number;
  datetime: string;
  fees: string;
  status: string;
  notes?: string;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "today" | "month">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doctorId = (() => {
    try {
      const stored = localStorage.getItem("doctor");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/doctor/${doctorId}/appointments/detailed`);
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  useEffect(() => {
    let filtered = [...appointments];

    if (filterType === "today") {
      filtered = filtered.filter((appt) =>
        moment(appt.datetime).isSame(moment(), "day")
      );
    } else if (filterType === "month") {
      filtered = filtered.filter((appt) =>
        moment(appt.datetime).isSame(moment(), "month")
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((appt) =>
        appt.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, filterType]);

  const statusColor = (status: string) => {
    if (status === "Completed") return "text-grey-600";
    if (status === "Cancelled") return "text-purple-800";
    return "text-gray-500";
  };

  const handleCancel = async (appointmentId: number) => {
    const confirm = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/doctor/appointments/${appointmentId}/cancel`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Try again.");
    }
  };

  const handleComplete = async (appointmentId: number) => {
    const confirm = window.confirm("Mark this appointment as completed?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/doctor/appointments/${appointmentId}/complete`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err) {
      console.error("Error completing appointment:", err);
      alert("Failed to complete appointment. Try again.");
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <DoctorLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-purple-700">All Appointments</h1>
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-purple-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-3 mb-6">
          {["all", "today", "month"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-md text-sm border ${
                filterType === type
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-600 border-purple-600"
              }`}
            >
              {type === "all" ? "All" : type === "today" ? "Today" : "This Month"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3 px-4 font-medium">#</th>
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Payment</th>
                <th className="py-3 px-4 font-medium">Age</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Fees</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt, index) => (
                <tr key={appt.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/32"
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    {appt.patient}
                  </td>
                  <td className="py-3 px-4">
                    <span className="border px-2 py-1 rounded-full text-xs">
                      {appt.payment || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{appt.age}</td>
                  <td className="py-3 px-4">{appt.datetime}</td>
                  <td className="py-3 px-4">{appt.fees}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${statusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {appt.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        title="Cancel"
                      className="text-purple-800 px-3 text-2xl hover:scale-110 transition"

                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    )}
                    {appt.status === "Scheduled" && (
                      <button
                        onClick={() => handleComplete(appt.id)}
                        title="Complete"
                        className="text-grey-500 text-2xl hover:scale-110 transition"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
