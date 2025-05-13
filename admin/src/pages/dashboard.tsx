// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import AppointmentsIcon from "../assets/appointments_icon.svg";
import PatientsIcon from "../assets/patients_icon.svg";
import DoctorIcon from "../assets/doctor_icon.svg";
import ListIcon from "../assets/list_icon.svg"; // Import the new icon

const appointmentsCount = 120;
const patientsCount = 80;
const doctorsList = [
  { name: "Dr. John Doe", specialty: "Cardiology" },
  { name: "Dr. Jane Smith", specialty: "Neurology" },
  { name: "Dr. Michael Johnson", specialty: "Orthopedics" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Count */}
          <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex items-center">
            <img
              src={AppointmentsIcon}
              alt="Appointments Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">Appointments</h3>
              <p className="text-3xl">{appointmentsCount}</p>
            </div>
          </div>

          {/* Patients Count */}
          <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex items-center">
            <img
              src={PatientsIcon}
              alt="Patients Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">Patients</h3>
              <p className="text-3xl">{patientsCount}</p>
            </div>
          </div>

          {/* Doctors Count */}
          <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex items-center">
            <img
              src={DoctorIcon}
              alt="Doctors Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">Doctors</h3>
              <p className="text-3xl">{doctorsList.length}</p>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <img
              src={ListIcon} // Use the new icon here
              alt="List Icon"
              className="w-8 h-8 mr-4"
            />
            List of Doctors
          </h2>
          <div className="space-y-4">
            {doctorsList.map((doctor, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <div>
                  <h4 className="text-xl font-semibold">{doctor.name}</h4>
                  <p className="text-gray-600">{doctor.specialty}</p>
                </div>
                <Link
                  to={`/doctor/${index}`} // Replace with actual doctor page
                  className="text-purple-600 hover:text-purple-800 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
