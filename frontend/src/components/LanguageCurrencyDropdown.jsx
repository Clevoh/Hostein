// src/components/LanguageCurrencyDropdown.jsx
import React, { useState, useRef, useEffect } from "react";

export default function LanguageCurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("English");
  const [currency, setCurrency] = useState("KES");
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
        aria-expanded={open}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border p-3 z-50 transform transition duration-150 ease-out opacity-100 scale-100">
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-600">Language</div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option>English</option>
              <option>Swahili</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600">Currency</div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full mt-2 p-2 border rounded"
            >
              <option>KES</option>
              <option>USD</option>
              <option>EUR</option>
              <option>TSH</option>
            </select>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
