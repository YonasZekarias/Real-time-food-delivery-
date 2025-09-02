import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/siderbar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 ml-24">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
