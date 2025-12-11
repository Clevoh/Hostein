// src/components/TopDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TopDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 px-3 py-2 border rounded-full hover:shadow transition"
        aria-expanded={open}
      >
        {/* globe icon (kept small) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"></path>
        </svg>
        <div className="w-8 h-8 bg-gray-100 rounded-full border flex items-center justify-center text-sm">H</div>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl py-2 border transform transition duration-150 ease-out opacity-100 scale-100 z-50">
          <Link to="/help" className="block px-4 py-2 hover:bg-gray-50 rounded">Help Centre</Link>
          <Link to="/become-host" className="block px-4 py-2 hover:bg-gray-50 rounded">Become a host</Link>
          <div className="border-t my-2" />
          <Link to="/login" className="block px-4 py-2 hover:bg-gray-50 rounded">Login</Link>
          <Link to="/signup" className="block px-4 py-2 hover:bg-gray-50 rounded">Signup</Link>
        </div>
      )}
    </div>
  );
}
