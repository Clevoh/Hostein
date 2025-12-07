import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between py-4 px-6">
          {/* LOGO */}
          <h1 className="text-3xl font-bold text-blue-600">Hostein</h1>

          {/* CENTER SEARCH BAR */}
          <div className="hidden md:flex items-center shadow-md rounded-full px-5 py-2 border w-1/2 hover:shadow-lg transition">
            <input
              type="text"
              placeholder="Search homes, rooms, locations..."
              className="w-full outline-none text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 border rounded-full hover:shadow-md transition"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl py-2 border text-gray-700">
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Help Centre
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Become a Host
                </Link>
                <hr className="my-2" />
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <h2 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Find Your Next Stay with Hostein
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          Discover rental homes, apartments, and unique stays—managed effortlessly.
        </p>

        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg shadow hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-5 text-gray-500 border-t">
        © {new Date().getFullYear()} Hostein – Property Management & Rentals
      </footer>
    </div>
  );
}