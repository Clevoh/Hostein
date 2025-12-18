// src/components/TopDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function TopDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded-full border hover:shadow transition"
        aria-label="Menu"
      >
        <FiMenu className="h-5 w-5 text-gray-700" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl py-2 border z-50">
          <Link to="/help" className="block px-4 py-2 hover:bg-gray-50 rounded">
            Help Centre
          </Link>
          <Link to="/become-host" className="block px-4 py-2 hover:bg-gray-50 rounded">
            Become a host
          </Link>
          <div className="border-t my-2" />
          <Link to="/login" className="block px-4 py-2 hover:bg-gray-50 rounded">
            Login
          </Link>
          <Link to="/signup" className="block px-4 py-2 hover:bg-gray-50 rounded">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
