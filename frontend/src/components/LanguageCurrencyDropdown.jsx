// src/components/LanguageCurrencyDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";

export default function LanguageCurrencyDropdown() {
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
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Language and currency"
      >
        <FiGlobe className="h-5 w-5 text-gray-700" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border p-4 z-50">
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600">Language</div>
            <select className="w-full mt-2 p-2 border rounded">
              <option>English</option>
              <option>Swahili</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600">Currency</div>
            <select className="w-full mt-2 p-2 border rounded">
              <option>KES</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
