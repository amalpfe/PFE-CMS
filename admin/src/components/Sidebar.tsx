import { Link } from "react-router-dom";

// Import your icons
import homeIcon from "../assets/home_icon.svg";
import appointmentIcon from "../assets/appointment_icon.svg";
import addDoctorIcon from "../assets/add_icon.svg";
import peopleIcon from "../assets/people_icon.svg";

const Sidebar = () => {
  return (
    <div>
      {/* Sidebar links */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img src={homeIcon} alt="Dashboard" className="w-6 h-6 mr-4" />
          Dashboard
        </Link>

        <Link
          to="/admin/appointments"
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
          to="/admin/doctors"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img src={addDoctorIcon} alt="Add Doctor" className="w-6 h-6 mr-4" />
          Add Doctor
        </Link>

        <Link
          to="/admin/doctor-list"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          <img src={peopleIcon} alt="Doctor List" className="w-6 h-6 mr-4" />
          Doctor List
        </Link>
        <Link
      to="/admin/patient-list"
      className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
      <img src={peopleIcon} alt="Patient List" className="w-6 h-6 mr-4" />
      Patient List
      </Link>

      </div>
    </div>
  );
};

export default Sidebar;
