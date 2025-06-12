import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: "Scheduled" | "Completed" | "Cancelled";
  payment?: string;
  age?: number;
  fees?: string;
  notes?: string;
  patientImage?: string; // 👈 أضفنا هيدا
}


const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "today" | "month">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/admin/recent-appointments");

        // تصليح id لو كان مش موجود
        const fixedData = response.data.map((appt: any) => ({
          ...appt,
          id: appt.id ?? appt.appointmentId,
        }));

        setAppointments(fixedData);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on search or date
  useEffect(() => {
    let filtered = [...appointments];

    if (filterType === "today") {
      filtered = filtered.filter((appt) =>
        moment(appt.appointmentDate).isSame(moment(), "day")
      );
    } else if (filterType === "month") {
      filtered = filtered.filter((appt) =>
        moment(appt.appointmentDate).isSame(moment(), "month")
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((appt) =>
        appt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, filterType]);

  const statusColor = (status: string) => {
    if (status === "Completed") return "text-green-600";
    if (status === "Cancelled") return "text-red-500";
    return "text-gray-500";
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await axios.put(`http://localhost:5000/admin/appointments/${appointmentId}`);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, appointmentStatus: "Cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <Layout>
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

        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-3 px-4 font-medium">#</th>
                  <th className="py-3 px-4 font-medium">Patient</th>
                  <th className="py-3 px-4 font-medium">Doctor</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
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
  src={appt.patientImage || "https://via.placeholder.com/32"}
  alt="avatar"
  className="w-8 h-8 rounded-full object-cover"
/>

                      {appt.patientName}
                    </td>
                    <td className="py-3 px-4">{appt.doctorName}</td>
                    <td className="py-3 px-4">
                      {moment(appt.appointmentDate).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${statusColor(appt.appointmentStatus)}`}>
                        {appt.appointmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {appt.appointmentStatus !== "Cancelled" ? (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentCalendar;
