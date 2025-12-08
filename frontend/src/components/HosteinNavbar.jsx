import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaBars } from "react-icons/fa";

export default function HosteinNavbar() {
  const [openHomes, setOpenHomes] = useState(false);
  const [openServices, setOpenServices] = useState(false);

  const homesRef = useRef(null);
  const servicesRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function closeMenus(e) {
      if (homesRef.current && !homesRef.current.contains(e.target)) {
        setOpenHomes(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setOpenServices(false);
      }
    }

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 shadow-md bg-white fixed top-0 left-0 z-50">

      {/* LOGO */}
      <Link to="/" className="flex items-center space-x-2 cursor-pointer">
        <span className="text-red-500 text-3xl font-extrabold">H</span>
        <span className="text-xl font-semibold text-gray-800">Hostein</span>
      </Link>

      {/* CENTER NAV */}
      <div className="hidden md:flex items-center space-x-10 text-gray-700 font-medium">

        {/* Homes Dropdown */}
        <div className="relative" ref={homesRef}>
          <button
            onClick={() => {
              setOpenHomes((s) => !s);
              setOpenServices(false);
            }}
            className="hover:text-black"
          >
            Homes
          </button>

          {openHomes && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg border rounded-lg p-2 z-50">
              <Link to="/rentals" className="block px-4 py-2 hover:bg-gray-100">Rentals</Link>
              <Link to="/apartments" className="block px-4 py-2 hover:bg-gray-100">Apartments</Link>
              <Link to="/single-rooms" className="block px-4 py-2 hover:bg-gray-100">Single Rooms</Link>
              <Link to="/hotel-rooms" className="block px-4 py-2 hover:bg-gray-100">Hotel Rooms</Link>
            </div>
          )}
        </div>

        {/* Services Dropdown */}
        <div className="relative" ref={servicesRef}>
          <button
            onClick={() => {
              setOpenServices((s) => !s);
              setOpenHomes(false);
            }}
            className="hover:text-black"
          >
            Services
          </button>

          {openServices && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white shadow-lg border rounded-lg p-2 z-50">
              <Link to="/meals" className="block px-4 py-2 hover:bg-gray-100">Meals</Link>
              <Link to="/translator" className="block px-4 py-2 hover:bg-gray-100">Translator</Link>
              <Link to="/tour-guide" className="block px-4 py-2 hover:bg-gray-100">Tour Guide</Link>
              <Link to="/trainer" className="block px-4 py-2 hover:bg-gray-100">Trainer</Link>
              <Link to="/massage" className="block px-4 py-2 hover:bg-gray-100">Massage</Link>
            </div>
          )}
        </div>
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
