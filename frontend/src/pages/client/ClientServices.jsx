import React from "react";

export default function ClientServices() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Services</h1>

      {/* List of services */}
      <div className="space-y-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold">No services scheduled</h3>
          <p className="text-gray-600">Service bookings will appear here.</p>
        </div>
      </div>
    </div>
  );
}
