// src/components/DoctorNavbar.tsx
import { Link, useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session data or tokens here
    navigate("/"); // Navigate back to login page
  };

  return (
    <div className="bg-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
      {/* Doctor Panel Logo */}
      <Link
        to="/doctor/dashboard"
        className="text-2xl font-bold hover:text-gray-100 transition"
      >
        Doctor Panel
      </Link>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

export default DoctorNavbar;
