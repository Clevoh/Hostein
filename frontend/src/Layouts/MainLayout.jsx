// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="pt-20 px-6 pb-8">
          <Outlet />   {/* THIS loads your dashboard pages correctly */}
        </main>
      </div>
    </div>
  );
}
