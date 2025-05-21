import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../components/Layout";

import DoctorIcon from "../assets/doctor_icon.svg";
import PatientIcon from "../assets/patients_icon.svg";
import AppointmentIcon from "../assets/appointments_icon.svg";

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
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]); // Initialize as array

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
        });

        // Fetch recent appointments
       const recentResponse = await axios.get("http://localhost:5000/admin/recent-appointments");

        console.log("Recent appointments API response:", recentResponse.data);

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

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        {/* Recent Appointments Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Patient</th>
                  <th className="py-3 px-4 text-left">Doctor</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-center text-gray-500">
                      No recent appointments found.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((appt, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{appt.patientName}</td>
                      <td className="py-3 px-4">{appt.doctorName}</td>
                      <td className="py-3 px-4">{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            appt.appointmentStatus === "Completed"
                              ? "bg-green-100 text-green-700"
                              : appt.appointmentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {appt.appointmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
