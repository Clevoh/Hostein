import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { useProperties } from "../../context/PropertyContext";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { refreshProperties } = useProperties();

  useEffect(() => {
    refreshProperties();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-20 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}