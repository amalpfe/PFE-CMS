// pages/appointment.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:5000/admin/recent-appointments");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedAppointments = response.data.map((appt: any) => ({
          id: String(appt.id),
          patientName: appt.patientName,
          doctorName: appt.doctorName,
          date: appt.appointmentDate.split("T")[0],
          time: appt.appointmentTime,
          status: appt.appointmentStatus,
        }));

        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

const handleStatusChange = async (id: string, newStatus: Appointment["status"]) => {
  const oldStatus = appointments.find(appt => appt.id === id)?.status;

  // Optimistically update UI
  setAppointments((prev) =>
    prev.map((appt) =>
      appt.id === id ? { ...appt, status: newStatus } : appt
    )
  );

  try {
    await axios.put(`http://localhost:5000/admin/appointments/${id}`, { status: newStatus });
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update status. Please try again.");

    // Revert UI if error
    if (oldStatus) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: oldStatus } : appt
        )
      );
    }
  }
};



  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Manage Appointments</h1>

        {loading && <p>Loading appointments...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Patient</th>
                  <th className="py-3 px-4 text-left">Doctor</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                )}
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b">
                    <td className="py-3 px-4">{appt.patientName}</td>
                    <td className="py-3 px-4">{appt.doctorName}</td>
                    <td className="py-3 px-4">{appt.date}</td>
                    <td className="py-3 px-4">{appt.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          appt.status === "Completed"
                            ? "bg-green-500"
                            : appt.status === "Cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) =>
                          handleStatusChange(
                            appt.id,
                            e.target.value as Appointment["status"]
                          )
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentList;
