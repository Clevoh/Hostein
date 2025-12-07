import React from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaBars } from "react-icons/fa";

export default function HosteinNavbar() {
  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 shadow-md bg-white fixed top-0 left-0 z-50">

      {/* LOGO */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <span className="text-red-500 text-3xl font-extrabold">H</span>
        <span className="text-xl font-semibold text-gray-800">Hostein</span>
      </div>

      {/* CENTER NAV */}
      <div className="hidden md:flex items-center space-x-10 text-gray-700 font-medium">
        <span className="hover:text-black cursor-pointer">Homes</span>
        <span className="hover:text-black cursor-pointer">Experiences</span>
        <span className="hover:text-black cursor-pointer">Services</span>
      </div>

      {/* RIGHT NAV */}
      <div className="flex items-center space-x-6">
        <Link
          to="/signup"
          className="hover:bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium"
        >
          Become a host
        </Link>

        <FaGlobe className="text-gray-600 cursor-pointer" />

        <div className="flex items-center space-x-2 border rounded-full px-3 py-1 cursor-pointer hover:shadow">
          <FaBars className="text-gray-700" />
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </nav>
  );
}
