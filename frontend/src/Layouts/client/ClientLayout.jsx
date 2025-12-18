import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout";

export default function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8">Client Dashboard</h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/client" className={isActive("/client")}>Dashboard</Link>
          <Link to="/client/bookings" className={isActive("/client/bookings")}>My Bookings</Link>
          <Link to="/client/services" className={isActive("/client/services")}>My Services</Link>
          <Link to="/client/profile" className={isActive("/client/profile")}>My Profile</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR (NEW) */}
        <header className="h-16 bg-white shadow flex items-center justify-end px-6">
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
