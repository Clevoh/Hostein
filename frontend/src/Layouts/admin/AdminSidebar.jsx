// src/Layouts/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `block px-4 py-3 rounded-lg font-medium transition ${
        isActive
          ? "bg-red-600 text-white"
          : "text-gray-700 hover:bg-gray-200"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Hostein Admin</h1>
      <p className="text-sm text-gray-500 mb-8">System control</p>

      <nav className="flex flex-col gap-2">
        <Item to="/admin">Overview</Item>
        <Item to="/admin/users">Users</Item>
        <Item to="/admin/properties">Properties</Item>
        <Item to="/admin/reports">Reports</Item>
      </nav>
    </aside>
  );
}
