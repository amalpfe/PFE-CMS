import { Link } from "react-router-dom";
import type { FC } from "react";

// استيراد الأيقونات
import homeIcon from "../assets/home_icon.svg";
import appointmentIcon from "../assets/appointment_icon.svg";
import addDoctorIcon from "../assets/add_icon.svg";
import peopleIcon from "../assets/people_icon.svg";
import paymentIcon from "../assets/patient_icon.svg";
import reportIcon from "../assets/appointments_icon.svg";

const Sidebar: FC = () => {
 

  return (
    <aside>
      <div className="flex flex-col space-y-6">
        <Link to="/staff/dashboard"
        className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={homeIcon} alt="Dashboard" className="w-6 h-6 mr-4" />
          Dashboard
        </Link>

        <Link to="/appointments" 
       className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={appointmentIcon} alt="Appointments" className="w-6 h-6 mr-4" />
          Appointments
        </Link>

        <Link to="/doctors"    className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={addDoctorIcon} alt="Doctors" className="w-6 h-6 mr-4" />
          Doctors
        </Link>

        <Link to="/patients"    className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={peopleIcon} alt="Patients" className="w-6 h-6 mr-4" />
          Patients
        </Link>

        <Link to="/payments"   className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={paymentIcon} alt="Payments" className="w-6 h-6 mr-4" />
          Payments
        </Link>

        <Link to="/reports"    className="flex items-center px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
          <img src={reportIcon} alt="Reports" className="w-6 h-6 mr-4" />
          Reports
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
