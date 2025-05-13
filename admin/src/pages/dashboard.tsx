// src/pages/Dashboard.tsx
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl border border-purple-600">
        <h1 className="text-3xl font-semibold text-purple-600 text-center mb-4">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-center text-lg">This is the dashboard where you can manage everything.</p>
        {/* Add additional sections, cards, or navigation as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
