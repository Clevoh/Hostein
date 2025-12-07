import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function HosteinSearchBar() {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="flex items-center bg-white rounded-full shadow-md border border-gray-200 px-2 py-2 w-full max-w-4xl">

        {/* WHERE */}
        <div className="flex flex-col px-6 py-2 flex-1">
          <label className="text-xs font-semibold text-gray-600">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* WHEN */}
        <div className="flex flex-col px-6 py-2 flex-1">
          <label className="text-xs font-semibold text-gray-600">When</label>
          <input
            type="text"
            placeholder="Add dates"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            className="outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* WHO */}
        <div className="flex flex-col px-6 py-2 flex-1">
          <label className="text-xs font-semibold text-gray-600">Who</label>
          <input
            type="text"
            placeholder="Add guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* SEARCH */}
        <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full mr-2">
          <FaSearch size={14} />
        </button>
      </div>
    </div>
  );
}
