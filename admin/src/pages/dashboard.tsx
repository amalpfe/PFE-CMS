import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, type Event } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { localizer } from "../utils/calendarLocalizer";

import Layout from "../components/Layout";

import DoctorIcon from "../assets/doctor_icon.svg";
import PatientIcon from "../assets/patients_icon.svg";
import AppointmentIcon from "../assets/appointments_icon.svg";
import FeesIcon from "../assets/earning_icon.svg"; // Add your fees icon here


type Appointment = {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: string;
};

const Dashboard = () => {
  const [counts, setCounts] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    totalFees: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const countsResponse = await axios.get("http://localhost:5000/admin/counts");
        setCounts({
          doctors: countsResponse.data.doctors,
          patients: countsResponse.data.patients,
          appointments: countsResponse.data.appointments,
          totalFees: countsResponse.data.totalFees ?? 0,
        });

        // Fetch recent appointments
        const recentResponse = await axios.get("http://localhost:5000/admin/recent-appointments");

        if (Array.isArray(recentResponse.data)) {
          setRecentAppointments(recentResponse.data);
        } else {
          setRecentAppointments([]);
          console.warn("Expected an array for recent appointments");
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Convert appointments to calendar events
  const events: Event[] = recentAppointments.map((appointment) => ({
    title: `${appointment.patientName} with Dr. ${appointment.doctorName}`,
    start: new Date(appointment.appointmentDate),
    end: new Date(appointment.appointmentDate),
    allDay: false,
  }));

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Admin Dashboard</h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Doctor Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img src={DoctorIcon} alt="Doctor" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">{counts.doctors}</p>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img src={PatientIcon} alt="Patient" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">{counts.patients}</p>
            </div>
          </div>

          {/* Appointment Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img src={AppointmentIcon} alt="Appointment" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">{counts.appointments}</p>
            </div>
          </div>

          {/* Total Fees Earned Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img src={FeesIcon} alt="Total Fees" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Fees Earned</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                ${counts.totalFees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mt-10 bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Doctor Appointments Calendar</h2>
          <div className="h-[500px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
