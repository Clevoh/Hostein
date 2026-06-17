// src/Layouts/service-provider/ServiceProviderLayout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import ServiceProviderSidebar from "./ServiceProviderSidebar";
import ServiceProviderTopbar from "./ServiceProviderTopbar";
import Notifications from "../../components/Notifications";

export default function ServiceProviderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen">
      <Notifications />

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <ServiceProviderTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}