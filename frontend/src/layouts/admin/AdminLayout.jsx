import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64 transition-all duration-300">
        <AdminTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="pt-20 px-4 md:px-8 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}