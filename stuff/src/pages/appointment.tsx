import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Select, Input, Button, message } from "antd";

const { Option } = Select;

type Appointment = {
  appointmentDate: string | number | Date;
  id: number;
  patientId?: number;
  doctorId?: number;
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
      message.error("Failed to fetch appointments");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/patients`);
      setPatients(res.data);
    } catch (err) {
      message.error("Failed to fetch patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      message.error("Failed to fetch doctors");
    }
  };

  const handleAddAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !newDate) {
      return message.warning("Please fill all fields");
    }

    try {
      await axios.post(`${API_BASE}/appointments`, {
        patientId: selectedPatientId,
        doctorId: selectedDoctorId,
        appointmentDate: newDate,
      });

      message.success("Appointment created");
      fetchAppointments();
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setNewDate("");
    } catch (err) {
      message.error("Failed to create appointment");
    }
  };

  const toggleCheckIn = async (id: number, currentStatus: string) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return message.error("Appointment not found");

    const newStatus = currentStatus === "Scheduled" ? "Completed" : "Scheduled";

    try {
      await axios.put(`${API_BASE}/appointments/${id}`, {
        appointmentDate: appt.appointmentDate || null,
        appointmentStatus: newStatus,
        notes: appt.notes ?? null,
      });

      fetchAppointments();
    } catch (err) {
      message.error("Failed to update appointment status");
    }
  };

  const cancelAppointment = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`${API_BASE}/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      message.error("Failed to cancel appointment");
    }
  };

  const rescheduleAppointment = async (id: number) => {
    const newDate = prompt("Enter new date/time (YYYY-MM-DDTHH:mm):");
    if (!newDate) return;
    const dateObj = new Date(newDate);
    if (isNaN(dateObj.getTime())) return message.warning("Invalid date format");

    try {
      await axios.put(`${API_BASE}/appointments/${id}`, {
        appointmentDate: newDate,
      });
      fetchAppointments();
    } catch (err) {
      message.error("Failed to reschedule appointment");
    }
  };

  const getPatientName = (id?: number) => patients.find((p) => p.id === id)?.name || "N/A";
  const getDoctorName = (id?: number) => doctors.find((d) => d.id === id)?.name || "N/A";

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Appointment Management</h1>

        <div className="mb-6 bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Schedule New Appointment</h2>

          <div className="flex flex-wrap gap-4 items-center mb-4">
            <Select
              showSearch
              placeholder="Select Patient"
              optionFilterProp="children"
              value={selectedPatientId || undefined}
              onChange={(value) => setSelectedPatientId(value)}
              style={{ minWidth: 200 }}
              filterOption={(input, option) =>
                (option?.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>

            <Select
              showSearch
              placeholder="Select Doctor"
              optionFilterProp="children"
              value={selectedDoctorId || undefined}
              onChange={(value) => setSelectedDoctorId(value)}
              style={{ minWidth: 200 }}
              filterOption={(input, option) =>
                (option?.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctors.map((d) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>

            <Input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ minWidth: 200 }}
            />

            <Button type="primary" onClick={handleAddAppointment}>
              Schedule
            </Button>
          </div>
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
                    <td className="border border-gray-300 px-4 py-2">{getPatientName(appt.patientId)}</td>
                    <td className="border border-gray-300 px-4 py-2">{getDoctorName(appt.doctorId)}</td>
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
