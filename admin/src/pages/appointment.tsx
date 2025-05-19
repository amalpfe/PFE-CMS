import React, { useState } from "react";
import Layout from "../components/Layout";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Alice Johnson",
      doctorName: "Dr. Sarah Williams",
      date: "2025-05-21",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: "2",
      patientName: "Bob Smith",
      doctorName: "Dr. John Doe",
      date: "2025-05-22",
      time: "2:30 PM",
      status: "Confirmed",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">
          Manage Appointments
        </h1>

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
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b">
                  <td className="py-3 px-4">{appt.patientName}</td>
                  <td className="py-3 px-4">{appt.doctorName}</td>
                  <td className="py-3 px-4">{appt.date}</td>
                  <td className="py-3 px-4">{appt.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        appt.status === "Confirmed"
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
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentList;
