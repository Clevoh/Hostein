import React from "react";
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";

export default function ClientDashboardHome() {
  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back 👋
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Here’s what’s happening with your account today.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Bookings"
          value="0"
          subtitle="Bookings made so far"
        />
        <StatCard
          title="Upcoming Bookings"
          value="0"
          subtitle="Scheduled stays"
        />
        <StatCard
          title="Active Services"
          value="0"
          subtitle="Ongoing services"
        />
        <StatCard
          title="Notifications"
          value="0"
          subtitle="Unread alerts"
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BOOKINGS */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Upcoming Bookings
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              You don’t have any bookings yet.
            </p>
          </div>

          <Link
            to="/rentals"
            className="mt-4 inline-flex items-center text-blue-600 font-medium hover:underline"
          >
            Browse homes →
          </Link>
        </div>

        {/* SERVICES */}
        <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Upcoming Services
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              No services scheduled.
            </p>
          </div>

          <Link
            to="/services"
            className="mt-4 inline-flex items-center text-blue-600 font-medium hover:underline"
          >
            Explore services →
          </Link>
        </div>

      </div>
    </div>
  );
}
