import { Link, useNavigate } from "react-router-dom";
import type { FC } from "react";

const Navbar: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage or local storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("staff");
    localStorage.removeItem("staffId");

    // Navigate to login page
    navigate("/staff-login");
  };

  return (
    <div className="bg-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
      {/* Title */}
      <Link
        to="/staff/dashboard"
       className="text-2xl font-bold hover:text-gray-100 transition"
      >
        Staff Panel
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

export default Navbar;
