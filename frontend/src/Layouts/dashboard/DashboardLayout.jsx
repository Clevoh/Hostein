import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* TOPBAR */}
      <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

      {/* MAIN CONTENT */}
      <main className="lg:ml-64 pt-24 px-6 transition-all">
        <Outlet />
      </main>
    </div>
  );
}
