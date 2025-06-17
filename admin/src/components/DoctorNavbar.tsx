import { Link, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    // Clear session data or tokens here if needed
    navigate("/"); // Navigate to the login page
  };

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="text-2xl font-bold hover:text-gray-100 transition"
      >
        Doctor Panel
      </Link>

      {/* Logout Button */}
      <button
        onClick={showLogoutModal}
        className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
      >
        Logout
      </button>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Yes, Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Navbar;
