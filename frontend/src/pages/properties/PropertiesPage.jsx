// src/pages/properties/PropertiesPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function PropertiesPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const searchLocation = query.get("location");
  const checkIn = query.get("checkIn");
  const checkOut = query.get("checkOut");
  const guests = query.get("guests");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Properties</h2>
      <p className="mb-6 text-gray-600">
        Showing results for <strong>{searchLocation}</strong>, from{" "}
        <strong>{checkIn}</strong> to <strong>{checkOut}</strong> for{" "}
        <strong>{guests}</strong> guest(s).
      </p>

      {/* Here you can later fetch filtered properties from backend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example placeholder cards */}
        <div className="bg-white shadow rounded-lg p-4">Property 1</div>
        <div className="bg-white shadow rounded-lg p-4">Property 2</div>
        <div className="bg-white shadow rounded-lg p-4">Property 3</div>
      </div>
    </div>
  );
}
