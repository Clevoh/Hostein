// src/Layouts/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="ml-64">
        <AdminTopbar />
        <main className="pt-20 px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
