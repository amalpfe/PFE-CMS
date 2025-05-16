// src/components/DoctorSidebar.tsx
import { Link } from "react-router-dom";

// You can reuse or import doctor-specific icons here
import homeIcon from "../assets/home_icon.svg";
import appointmentIcon from "../assets/appointment_icon.svg";
import profileIcon from "../assets/people_icon.svg"; // Reusing people icon for Profile

const DoctorSidebar = () => {
  return (
    <div>
      {/* Sidebar links */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/doctor/dashboard"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img src={homeIcon} alt="Dashboard" className="w-6 h-6 mr-4" />
          Dashboard
        </Link>

        <Link
          to="/doctor/appointments"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img
            src={appointmentIcon}
            alt="Appointments"
            className="w-6 h-6 mr-4"
          />
          Appointments
        </Link>

        <Link
          to="/doctor/profile"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img src={profileIcon} alt="Profile" className="w-6 h-6 mr-4" />
          Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorSidebar;
