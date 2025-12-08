// src/components/layout/Topbar.jsx
import React from "react";

export default function Topbar() {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6 fixed top-0 left-64 z-10">
      <div className="text-lg font-semibold">Overview</div>
      <div className="flex items-center gap-4">
        <button className="px-3 py-1 rounded bg-gray-100">Notifications</button>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Cleve</div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            C
          </div>
        </div>
      </div>
    </header>
  );
}
