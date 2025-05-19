
import Layout from "../components/Layout";

// Import your SVG icons

import DoctorIcon from "../assets/doctor_icon.svg";
import PatientIcon from "../assets/patients_icon.svg";
import AppointmentIcon from "../assets/appointments_icon.svg";

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img
              src={DoctorIcon}
              alt="Doctor"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">12</p>
            </div>
          </div>

          {/* Patient Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img
              src={PatientIcon}
              alt="Patient"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">45</p>
            </div>
          </div>

          {/* Appointment Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
            <img
              src={AppointmentIcon}
              alt="Appointment"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
              <p className="text-3xl font-bold text-purple-600 mt-1">87</p>
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
                <tr className="border-b">
                  <td className="py-3 px-4">Jane Smith</td>
                  <td className="py-3 px-4">Dr. Williams</td>
                  <td className="py-3 px-4">2025-05-19</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">Completed</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">John Doe</td>
                  <td className="py-3 px-4">Dr. Doe</td>
                  <td className="py-3 px-4">2025-05-18</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
