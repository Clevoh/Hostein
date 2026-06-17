// src/components/layout/Topbar.jsx

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Topbar() {
  return (
    <header className="w-full h-16 bg-white dark:bg-[#141418] shadow flex items-center justify-between px-6 fixed top-0 left-64 z-10 border-b border-gray-200 dark:border-white/10">
      
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        Overview
      </div>

      <div className="flex items-center gap-4">

        {/* THEME TOGGLE */}
        <ThemeToggle />

        <button className="px-3 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-white">
          Notifications
        </button>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Cleve
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            C
          </div>
        </div>

      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}