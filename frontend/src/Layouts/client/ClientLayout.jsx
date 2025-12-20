import React from "react";
import { Outlet, Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../utils/logout";

export default function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 bg-white shadow-md p-6 flex-col">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">
          Client Dashboard
        </h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/client" className={isActive("/client")}>Dashboard</Link>
          <Link to="/client/bookings" className={isActive("/client/bookings")}>My Bookings</Link>
          <Link to="/client/services" className={isActive("/client/services")}>My Services</Link>
          <Link to="/client/profile" className={isActive("/client/profile")}>My Profile</Link>
        </nav>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ================= TOP BAR ================= */}
        <header className="h-14 md:h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
          <h1 className="md:hidden font-bold text-blue-600">Hostein</h1>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* ================= MOBILE BOTTOM NAV ================= */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm">
          <NavLink to="/client" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Home
          </NavLink>
          <NavLink to="/client/bookings" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Bookings
          </NavLink>
          <NavLink to="/client/services" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Services
          </NavLink>
          <NavLink to="/client/profile" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Profile
          </NavLink>
        </nav>

      </div>
    </div>
  );
}
