// src/layouts/MainLayout.jsx
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="pt-20 px-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
