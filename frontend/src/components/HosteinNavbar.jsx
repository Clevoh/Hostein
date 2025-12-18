import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import { useAuth } from "../context/AuthContext";

export default function HosteinNavbar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          
          {/* LEFT — LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-red-500 text-3xl font-extrabold">H</span>
            <span className="text-lg font-semibold text-gray-800">Hostein</span>
          </Link>

          {/* CENTER — SEARCH */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <div className="w-full max-w-3xl">{children}</div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            
            {/* Become host (only if NOT logged in) */}
            {!user && (
              <Link
                to="/signup"
                className="hidden md:inline-block px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
              >
                Become a host
              </Link>
            )}

            {/* Globe icon (ALWAYS visible on desktop) */}
            <div className="hidden md:block">
              <LanguageCurrencyDropdown />
            </div>

            {/* Auth buttons (desktop) */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-block px-4 py-2 rounded-full text-sm hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:inline-block px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden md:inline-block px-4 py-2 rounded-full text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label="Open menu"
            >
              <FaBars className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-semibold">Hostein</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-50">
            Homes
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-50">
                Login
              </Link>
              <Link to="/signup" className="block px-3 py-2 rounded hover:bg-gray-50">
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}
