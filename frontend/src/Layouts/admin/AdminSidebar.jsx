// src/Layouts/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { X, LayoutDashboard, Users, Home, FileText } from "lucide-react";

const Item = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    end
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
        isActive
          ? "bg-red-600 text-white"
          : "text-gray-700 hover:bg-gray-200"
      }`
    }
  >
    <Icon size={20} />
    <span>{children}</span>
  </NavLink>
);

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg p-6 z-30">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-600 mb-1">Hostein Admin</h1>
          <p className="text-sm text-gray-500">System control</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Item to="/admin" icon={LayoutDashboard}>Overview</Item>
          <Item to="/admin/users" icon={Users}>Users</Item>
          <Item to="/admin/properties" icon={Home}>Properties</Item>
          <Item to="/admin/reports" icon={FileText}>Reports</Item>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg p-6 z-30 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-600 mb-1">Hostein Admin</h1>
          <p className="text-sm text-gray-500">System control</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Item to="/admin" icon={LayoutDashboard} onClick={onClose}>
            Overview
          </Item>
          <Item to="/admin/users" icon={Users} onClick={onClose}>
            Users
          </Item>
          <Item to="/admin/properties" icon={Home} onClick={onClose}>
            Properties
          </Item>
          <Item to="/admin/reports" icon={FileText} onClick={onClose}>
            Reports
          </Item>
        </nav>
      </aside>
    </>
  );
}
