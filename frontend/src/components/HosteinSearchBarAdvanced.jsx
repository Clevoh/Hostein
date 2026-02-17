// src/components/HosteinSearchBarAdvanced.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Search, X, Plus, Minus } from "lucide-react";

export default function HosteinSearchBarAdvanced() {
  const [location, setLocation]           = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn]             = useState("");
  const [checkOut, setCheckOut]           = useState("");
  const [guestCounts, setGuestCounts]     = useState({ adults: 1, children: 0, infants: 0 });
  const [openWhen, setOpenWhen]           = useState(false);
  const [openWho, setOpenWho]             = useState(false);
  const [activeField, setActiveField]     = useState(null); // "where" | "when" | "who"

  const wrapperRef = useRef(null);
  const navigate   = useNavigate();

  const citySuggestions = [
    { city: "Nairobi",        country: "Kenya" },
    { city: "Mombasa",        country: "Kenya" },
    { city: "Kisumu",         country: "Kenya" },
    { city: "Kampala",        country: "Uganda" },
    { city: "Entebbe",        country: "Uganda" },
    { city: "Kigali",         country: "Rwanda" },
    { city: "Dar es Salaam",  country: "Tanzania" },
    { city: "Arusha",         country: "Tanzania" },
    { city: "Zanzibar",       country: "Tanzania" },
    { city: "Bujumbura",      country: "Burundi" },
  ];

  const filtered = citySuggestions.filter(
    (s) =>
      s.city.toLowerCase().includes(location.toLowerCase()) ||
      s.country.toLowerCase().includes(location.toLowerCase())
  );

  // Close all on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setOpenWhen(false);
        setOpenWho(false);
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut && checkOut < checkIn) setCheckOut("");
  }, [checkIn]);

  const handleGuestChange = (key, delta) => {
    setGuestCounts((prev) => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      if (next.adults === 0) next.adults = 1;
      return next;
    });
  };

  const totalGuests = guestCounts.adults + guestCounts.children;

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const whenLabel = () => {
    if (checkIn && checkOut) return `${formatDate(checkIn)} – ${formatDate(checkOut)}`;
    if (checkIn) return `From ${formatDate(checkIn)}`;
    return null;
  };

  const whoLabel = () => {
    const parts = [];
    if (totalGuests > 0) parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`);
    if (guestCounts.infants > 0) parts.push(`${guestCounts.infants} infant${guestCounts.infants > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      ...(location  && { location }),
      ...(checkIn   && { checkIn }),
      ...(checkOut  && { checkOut }),
      adults:   guestCounts.adults,
      children: guestCounts.children,
      infants:  guestCounts.infants,
    });
    navigate(`/rentals?${params.toString()}`);
  };

  const openField = (field) => {
    setActiveField(field);
    setShowSuggestions(field === "where");
    setOpenWhen(field === "when");
    setOpenWho(field === "who");
  };

  return (
    <div ref={wrapperRef} className="w-full flex justify-center">
      <form
        onSubmit={handleSearch}
        className="relative flex items-stretch bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-100 overflow-visible w-full max-w-3xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── WHERE ── */}
        <div
          className={`relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer transition rounded-l-2xl ${
            activeField === "where" ? "bg-gray-50" : "hover:bg-gray-50/60"
          }`}
          onClick={() => openField("where")}
        >
          <MapPin size={18} className="text-orange-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Where</p>
            <input
              type="text"
              value={location}
              placeholder="Search destinations..."
              onChange={(e) => { setLocation(e.target.value); setShowSuggestions(true); setActiveField("where"); }}
              onFocus={() => openField("where")}
              className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none placeholder-gray-400 truncate"
            />
          </div>
          {location && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setLocation(""); }} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Suggested Destinations
              </p>
              {filtered.length > 0 ? (
                filtered.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setLocation(`${s.city}, ${s.country}`); setShowSuggestions(false); setActiveField(null); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.city}</p>
                      <p className="text-xs text-gray-400">{s.country}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">No locations found</p>
              )}
              <div className="pb-2" />
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="w-px bg-gray-200 my-3" />

        {/* ── WHEN ── */}
        <div
          className={`relative flex items-center gap-3 px-5 py-4 cursor-pointer transition min-w-[160px] ${
            activeField === "when" ? "bg-gray-50" : "hover:bg-gray-50/60"
          }`}
          onClick={() => openField("when")}
        >
          <Calendar size={18} className="text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">When</p>
            <p className={`text-sm font-medium ${whenLabel() ? "text-gray-800" : "text-gray-400"}`}>
              {whenLabel() || "Add dates"}
            </p>
          </div>

          {/* Date picker dropdown */}
          {openWhen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Select Dates</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-400 transition"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setCheckIn(""); setCheckOut(""); }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Clear
                </button>
                <button type="button" onClick={() => { setOpenWhen(false); setActiveField(null); }}
                  className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="w-px bg-gray-200 my-3" />

        {/* ── WHO ── */}
        <div
          className={`relative flex items-center gap-3 px-5 py-4 cursor-pointer transition min-w-[140px] ${
            activeField === "who" ? "bg-gray-50" : "hover:bg-gray-50/60"
          }`}
          onClick={() => openField("who")}
        >
          <Users size={18} className="text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Who</p>
            <p className={`text-sm font-medium ${totalGuests > 0 ? "text-gray-800" : "text-gray-400"}`}>
              {whoLabel()}
            </p>
          </div>

          {/* Guest dropdown */}
          {openWho && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Guests</p>

              <div className="space-y-1 divide-y divide-gray-100">
                <GuestRow label="Adults"   sub="Ages 13+"  count={guestCounts.adults}   onMinus={() => handleGuestChange("adults",   -1)} onPlus={() => handleGuestChange("adults",   1)} />
                <GuestRow label="Children" sub="Ages 2–12" count={guestCounts.children} onMinus={() => handleGuestChange("children", -1)} onPlus={() => handleGuestChange("children", 1)} />
                <GuestRow label="Infants"  sub="Under 2"   count={guestCounts.infants}  onMinus={() => handleGuestChange("infants",  -1)} onPlus={() => handleGuestChange("infants",  1)} />
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setGuestCounts({ adults: 1, children: 0, infants: 0 })}
                  className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Reset
                </button>
                <button type="button" onClick={() => { setOpenWho(false); setActiveField(null); }}
                  className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SEARCH BUTTON ── */}
        <div className="flex items-center px-3 py-3">
          <button
            type="submit"
            className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl px-5 py-3 flex items-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-orange-400/30 whitespace-nowrap"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

function GuestRow({ label, sub, count, onMinus, onPlus }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMinus}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition text-gray-600 disabled:opacity-30"
          disabled={count === 0}
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-gray-800">{count}</span>
        <button
          type="button"
          onClick={onPlus}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition text-gray-600"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
