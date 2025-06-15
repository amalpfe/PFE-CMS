import { Link } from "react-router-dom";

// Replace these imports with your actual icon files or URLs
import homeIcon from "../assets/home_icon.svg";
import appointmentIcon from "../assets/appointment_icon.svg";
import addDoctorIcon from "../assets/add_icon.svg";
import peopleIcon from "../assets/people_icon.svg";
import paymentsIcon from "../assets/payments_icon.svg"; // add your own icons
import reportsIcon from "../assets/reports_icon.svg";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-purple-50 border-r border-purple-300 shadow-sm h-full p-6">
      <nav className="flex flex-col space-y-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={homeIcon} alt="Dashboard" className="w-6 h-6 mr-4" />
          Dashboard
        </Link>

        <Link
          to="/admin/appointments"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
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
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={addDoctorIcon} alt="Add Doctor" className="w-6 h-6 mr-4" />
          Add Doctor
        </Link>

        <Link
          to="/admin/doctor-list"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={peopleIcon} alt="Doctor List" className="w-6 h-6 mr-4" />
          Doctor List
        </Link>

        <Link
          to="/admin/patient-list"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={peopleIcon} alt="Patient List" className="w-6 h-6 mr-4" />
          Patient List
        </Link>

        <Link
          to="/admin/payments"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={paymentsIcon} alt="Payments" className="w-6 h-6 mr-4" />
          Payments
        </Link>

        <Link
          to="/admin/reports"
          className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-300"
        >
          <img src={reportsIcon} alt="Reports" className="w-6 h-6 mr-4" />
          Reports
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
