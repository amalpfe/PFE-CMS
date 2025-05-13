import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session data or tokens here
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="bg-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="text-2xl font-bold hover:text-gray-100 transition"
      >
        Admin Panel
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
