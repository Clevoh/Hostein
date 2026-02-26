import { Outlet } from "react-router-dom";
import { useState } from "react";
import ServiceProviderSidebar from "./ServiceProviderSidebar";
import ServiceProviderTopbar from "./ServiceProviderTopbar";

export default function ServiceProviderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN AREA */}
      <div className="lg:ml-64">
        <ServiceProviderTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
