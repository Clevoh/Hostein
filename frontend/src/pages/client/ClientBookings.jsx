import React from "react";

export default function ClientBookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {/* List of bookings */}
      <div className="space-y-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold">No bookings yet</h3>
          <p className="text-gray-600">Your bookings will appear here.</p>
        </div>
      </div>
    </div>
  );
}
