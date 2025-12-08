// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow fixed left-0 top-0 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Hostein</h1>
        <p className="text-sm text-gray-500">Property management</p>
      </div>

      <nav className="flex flex-col gap-2">
        <LinkItem to="/">Dashboard</LinkItem>
        <LinkItem to="/properties">Properties</LinkItem>
        <LinkItem to="/units">Units</LinkItem>
        <LinkItem to="/tenants">Tenants</LinkItem>
        <LinkItem to="/payments">Payments</LinkItem>
      </nav>
    </aside>
  );
}
