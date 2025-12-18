// src/layouts/dashboard/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Content area */}
      <div className="ml-64">
        <DashboardTopbar />

        {/* Where dashboard pages appear */}
        <main className="pt-20 px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
