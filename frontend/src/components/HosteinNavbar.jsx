// src/components/HosteinNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import TopDropdown from "./TopDropdown";

export default function HosteinNavbar({ children }) {
  const [openHomes, setOpenHomes] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const homesRef = useRef(null);
  const servicesRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function closeMenus(e) {
      if (homesRef.current && !homesRef.current.contains(e.target)) {
        setOpenHomes(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setOpenServices(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        // don't auto-close the mobile menu here (it has its own close)
      }
    }

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="w-full flex items-center justify-between px-6 md:px-10 py-3 md:py-4 bg-white fixed top-0 left-0 z-50 border-b border-gray-100"
      >
        {/* LEFT: Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="text-red-500 text-3xl font-extrabold">H</span>
            <span className="text-lg md:text-xl font-semibold text-gray-800">
              Hostein
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            <div className="relative" ref={homesRef}>
              <button
                onClick={() => {
                  setOpenHomes((s) => !s);
                  setOpenServices(false);
                }}
                className="hover:text-black transition"
              >
                Homes
              </button>

              {openHomes && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white shadow-lg border rounded-lg p-2 z-50 transform transition ease-out duration-150 opacity-100 scale-100">
                  <Link to="/rentals" className="block px-4 py-2 hover:bg-gray-50 rounded">
                    Rentals
                  </Link>
                  <Link to="/apartments" className="block px-4 py-2 hover:bg-gray-50 rounded">
                    Apartments
                  </Link>
                  <Link to="/single-rooms" className="block px-4 py-2 hover:bg-gray-50 rounded">
                    Single Rooms
                  </Link>
                  <Link to="/hotel-rooms" className="block px-4 py-2 hover:bg-gray-50 rounded">
                    Hotel Rooms
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => {
                  setOpenServices((s) => !s);
                  setOpenHomes(false);
                }}
                className="hover:text-black transition"
              >
                Services
              </button>

              {openServices && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg border rounded-lg p-2 z-50 transform transition ease-out duration-150 opacity-100 scale-100">
                  <Link to="/meals" className="block px-4 py-2 hover:bg-gray-50 rounded">Meals</Link>
                  <Link to="/translator" className="block px-4 py-2 hover:bg-gray-50 rounded">Translator</Link>
                  <Link to="/tour-guide" className="block px-4 py-2 hover:bg-gray-50 rounded">Tour Guide</Link>
                  <Link to="/trainer" className="block px-4 py-2 hover:bg-gray-50 rounded">Trainer</Link>
                  <Link to="/massage" className="block px-4 py-2 hover:bg-gray-50 rounded">Massage</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER: desktop search (children) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          {/* children expected to be the search bar */}
          <div className="w-full max-w-3xl">{children}</div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            to="/signup"
            className="hidden md:inline-block px-4 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Become a host
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <LanguageCurrencyDropdown />
            <TopDropdown />
          </div>

          {/* Mobile controls */}
          <button
            aria-label="Open menu"
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(true)}
          >
            {/* hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE slide-in menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl font-extrabold">H</span>
            <span className="font-semibold">Hostein</span>
          </div>
          <button
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* mobile content */}
        <div className="px-4 py-4 space-y-4 overflow-y-auto">
          {/* search inside mobile menu */}
          <div>{/* optionally render a simpler search or link to search page */}</div>

          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-50">Homes</Link>
          <Link to="/services" className="block px-3 py-2 rounded hover:bg-gray-50">Services</Link>

          <div className="border-t my-2" />

          <Link to="/become-host" className="block px-3 py-2 rounded hover:bg-gray-50">Become a host</Link>
          <Link to="/help" className="block px-3 py-2 rounded hover:bg-gray-50">Help Centre</Link>
          <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-50">Login</Link>
          <Link to="/signup" className="block px-3 py-2 rounded hover:bg-gray-50">Sign up</Link>

          <div className="border-t my-2" />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Language</div>
              <div className="text-sm">English</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Currency</div>
              <div className="text-sm">KES</div>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}
