// src/components/HosteinSearchBarAdvanced.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function HosteinSearchBarAdvanced() {
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [openWhen, setOpenWhen] = useState(false);
  const [openWho, setOpenWho] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Suggested East African cities
  const citySuggestions = [
    { city: "Nairobi, Kenya" },
    { city: "Mombasa, Kenya" },
    { city: "Kisumu, Kenya" },
    { city: "Kampala, Uganda" },
    { city: "Entebbe, Uganda" },
    { city: "Kigali, Rwanda" },
    { city: "Dar es Salaam, Tanzania" },
    { city: "Arusha, Tanzania" },
    { city: "Zanzibar, Tanzania" },
    { city: "Bujumbura, Burundi" },
  ];

  // Close all popups when clicked outside
  useEffect(() => {
    function closeAll(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setOpenWhen(false);
        setOpenWho(false);
      }
    }
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  // Ensure proper check-in/out dates
  useEffect(() => {
    if (checkIn && checkOut && checkOut < checkIn) {
      setCheckOut("");
    }
  }, [checkIn, checkOut]);

  const handleGuestChange = (key, delta) => {
    setGuestCounts((prev) => {
      const updated = { ...prev, [key]: Math.max(0, prev[key] + delta) };

      if (updated.adults === 0 && (updated.children > 0 || updated.infants > 0)) {
        updated.adults = 1;
      }
      if (!updated.adults && !updated.children && !updated.infants) {
        updated.adults = 1;
      }
      return updated;
    });
  };

  const totalGuests = guestCounts.adults + guestCounts.children;

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      adults: guestCounts.adults,
      children: guestCounts.children,
      infants: guestCounts.infants,
    });

    navigate(`/dashboard/properties?${params.toString()}`);
  };

  return (
    <div ref={wrapperRef} className="w-full flex justify-center">
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 w-full max-w-4xl relative"
      >

        {/* WHERE SECTION */}
        <div className="relative flex flex-col px-4 py-2 flex-1">
          <label className="text-xs font-semibold text-gray-600">Where</label>

          <input
            type="text"
            value={location}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search homes, rooms, locations..."
            className="text-sm bg-transparent outline-none text-gray-700"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl border mt-2 z-50 py-2">
              {citySuggestions
                .filter((item) =>
                  item.city.toLowerCase().includes(location.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setLocation(item.city);
                      setShowSuggestions(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="text-gray-700 text-sm">{item.city}</span>
                  </div>
                ))}

              {/* No match */}
              {citySuggestions.filter((item) =>
                item.city.toLowerCase().includes(location.toLowerCase())
              ).length === 0 && (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No matching locations
                </div>
              )}
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="w-px h-9 bg-gray-200 mx-2" />

        {/* WHEN SECTION */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenWhen((s) => !s);
              setOpenWho(false);
              setShowSuggestions(false);
            }}
            className="flex flex-col px-4 py-2 min-w-[150px] text-left"
          >
            <span className="text-xs font-semibold text-gray-600">When</span>
            <span className="text-sm text-gray-700">
              {checkIn && checkOut ? `${checkIn} → ${checkOut}` : "Add dates"}
            </span>
          </button>

          {openWhen && (
            <div className="absolute top-12 left-0 z-50 bg-white rounded-lg shadow-lg border p-4 w-72">
              <label className="text-xs text-gray-600">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />

              <label className="text-xs text-gray-600 mt-3">Check-out</label>
              <input
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn("");
                    setCheckOut("");
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpenWhen(false)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="w-px h-9 bg-gray-200 mx-2" />

        {/* WHO SECTION */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenWho((s) => !s);
              setOpenWhen(false);
              setShowSuggestions(false);
            }}
            className="flex flex-col px-4 py-2 min-w-[130px] text-left"
          >
            <span className="text-xs font-semibold text-gray-600">Who</span>
            <span className="text-sm text-gray-700">
              {totalGuests} guest{totalGuests > 1 ? "s" : ""}{" "}
              {guestCounts.infants > 0 &&
                `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? "s" : ""}`}
            </span>
          </button>

          {openWho && (
            <div className="absolute top-12 right-0 z-50 bg-white rounded-lg shadow-lg border p-4 w-64">

              <GuestRow
                label="Adults"
                sub="Ages 13+"
                count={guestCounts.adults}
                onMinus={() => handleGuestChange("adults", -1)}
                onPlus={() => handleGuestChange("adults", 1)}
              />

              <GuestRow
                label="Children"
                sub="Ages 2–12"
                count={guestCounts.children}
                onMinus={() => handleGuestChange("children", -1)}
                onPlus={() => handleGuestChange("children", 1)}
              />

              <GuestRow
                label="Infants"
                sub="Under 2"
                count={guestCounts.infants}
                onMinus={() => handleGuestChange("infants", -1)}
                onPlus={() => handleGuestChange("infants", 1)}
              />

              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setGuestCounts({ adults: 1, children: 0, infants: 0 })
                  }
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => setOpenWho(false)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-indigo-700 text-white p-3 ml-3 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" stroke="white" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function GuestRow({ label, sub, count, onMinus, onPlus }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          -
        </button>
        <div className="w-6 text-center">{count}</div>
        <button
          type="button"
          onClick={onPlus}
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}
