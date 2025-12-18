import React from "react";

export default function ClientDashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Upcoming Booking */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Upcoming Booking</h2>
          <p>No upcoming bookings yet.</p>
        </div>

        {/* Upcoming Services */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Upcoming Services</h2>
          <p>You have no scheduled services.</p>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Notifications</h2>
          <p>No new notifications.</p>
        </div>

      </div>
    </div>
  );
}
