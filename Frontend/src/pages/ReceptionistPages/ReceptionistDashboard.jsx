// src/pages/receptionist/Dashboard.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const ReceptionistDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Receptionist Dashboard</h1>
      <nav className="flex gap-4 mb-6">
        <Link to="revenue" className="text-blue-600 hover:underline">
          Doanh thu
        </Link>
        <Link to="equipment" className="text-blue-600 hover:underline">
          Thiết bị
        </Link>
        <Link to="membership-approval" className="text-blue-600 hover:underline">
          Duyệt gói tập
        </Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default ReceptionistDashboard;
