import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function ClientLayout() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8">Client Dashboard</h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/client" className={isActive("/client")}>
            Dashboard
          </Link>

          <Link to="/client/bookings" className={isActive("/client/bookings")}>
            My Bookings
          </Link>

          <Link to="/client/services" className={isActive("/client/services")}>
            My Services
          </Link>

          <Link to="/client/profile" className={isActive("/client/profile")}>
            My Profile
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
