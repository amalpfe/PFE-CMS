import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

type Appointment = {
  appointmentDate: string | number | Date;
  id: number;
  patientId?: number;
  doctorId?: number;
  patientName: string;
  doctorName: string;
  appointmentStatus: string;
  notes?: string;
};

type Person = {
  id: number;
  name: string;
};

const API_BASE = "http://localhost:5000/staff";

const Appointment = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Person[]>([]);
  const [doctors, setDoctors] = useState<Person[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | "">("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | "">("");
  const [newDate, setNewDate] = useState("");
  const [showTodayOnly, setShowTodayOnly] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, [showTodayOnly]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/appointments`);
      let data = res.data;

      if (showTodayOnly) {
        const today = new Date().toISOString().split("T")[0];
        data = data.filter((appt: Appointment) => {
          const apptDate = new Date(appt.appointmentDate).toISOString().split("T")[0];
          return apptDate === today;
        });
      }

      setAppointments(data);
    } catch (err) {
      alert("Failed to fetch appointments");
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/patients`);
      setPatients(res.data);
    } catch (err) {
      alert("Failed to fetch patients");
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      alert("Failed to fetch doctors");
      console.error(err);
    }
  };

  const handleAddAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !newDate) {
      return alert("Please fill all fields");
    }

    try {
      await axios.post(`${API_BASE}/appointments`, {
        patientId: selectedPatientId,
        doctorId: selectedDoctorId,
        appointmentDate: newDate,
      });

      alert("Appointment created");
      fetchAppointments();
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setNewDate("");
    } catch (err) {
      alert("Failed to create appointment");
      console.error(err);
    }
  };

const toggleCheckIn = async (id: number, currentStatus: string) => {
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return alert("Appointment not found");

  const newStatus = currentStatus === "Scheduled" ? "Completed" : "Scheduled";

  try {
    await axios.put(`${API_BASE}/appointments/${id}`, {
      appointmentDate: appt.appointmentDate || null,
      appointmentStatus: newStatus,
      notes: appt.notes ?? null,
    });

    fetchAppointments();
  } catch (err) {
    alert("Failed to update appointment status");
    console.error(err);
  }
};


  const cancelAppointment = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`${API_BASE}/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      alert("Failed to cancel appointment");
      console.error(err);
    }
  };

  const rescheduleAppointment = async (id: number) => {
    const newDate = prompt("Enter new date/time (YYYY-MM-DDTHH:mm):");
    if (!newDate) return;
    const dateObj = new Date(newDate);
    if (isNaN(dateObj.getTime())) return alert("Invalid date format");

    try {
      await axios.put(`${API_BASE}/appointments/${id}`, {
        appointmentDate: newDate,
      });
      fetchAppointments();
    } catch (err) {
      alert("Failed to reschedule appointment");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Appointment Management</h1>

        <div className="mb-6 bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Schedule New Appointment</h2>

         <select
  value={selectedPatientId}
  onChange={(e) => setSelectedPatientId(Number(e.target.value) || "")}
  className="border rounded px-3 py-2 mr-2 text-black bg-white"
>
  <option value="">Select Patient</option>
  {patients.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

<select
  value={selectedDoctorId}
  onChange={(e) => setSelectedDoctorId(Number(e.target.value) || "")}
  className="border rounded px-3 py-2 mr-2 text-black bg-white"
>
  <option value="">Select Doctor</option>
  {doctors.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}
    </option>
  ))}
</select>


          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border rounded px-3 py-2 mr-2"
          />

          <button
            onClick={handleAddAppointment}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Schedule
          </button>
        </div>

        <div className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Appointments</h2>
            <div>
              <label className="mr-2 font-medium">Show:</label>
              <select
                className="border px-3 py-1 rounded"
                value={showTodayOnly ? "today" : "all"}
                onChange={(e) => setShowTodayOnly(e.target.value === "today")}
              >
                <option value="today">Today's Appointments</option>
                <option value="all">All Appointments</option>
              </select>
            </div>
          </div>

          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Patient</th>
                  <th className="border border-gray-300 px-4 py-2">Doctor</th>
                  <th className="border border-gray-300 px-4 py-2">Date & Time</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="border border-gray-300 px-4 py-2">{appt.patientName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{appt.doctorName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(appt.appointmentDate).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appt.appointmentStatus}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2 text-center">
                      <button
                        onClick={() => toggleCheckIn(appt.id, appt.appointmentStatus)}
                        className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-white"
                      >
                        {appt.appointmentStatus === "Scheduled" ? "Check In" : "Undo Check-In"}
                      </button>
                      <button
                        onClick={() => rescheduleAppointment(appt.id)}
                        className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
