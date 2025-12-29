// src/pages/client/ClientDashboardHome.jsx
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";

export default function ClientDashboardHome() {
  return (
    <div className="space-y-8 max-w-6xl">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back 
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Here’s what’s happening with your account.
          </p>
        </div>

        <Link
          to="/rentals"
          className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Find a home
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Bookings" value="0" subtitle="Bookings made" />
        <StatCard title="Upcoming" value="0" subtitle="Scheduled stays" />
        <StatCard title="Active Services" value="0" subtitle="Ongoing services" />
        <StatCard title="Notifications" value="0" subtitle="Unread alerts" />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Upcoming Bookings
            </h2>
            <p className="text-gray-600">
              You don’t have any bookings yet.
            </p>
          </div>

          <Link
            to="/rentals"
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Browse homes →
          </Link>
        </div>

        <div className="bg-white rounded-xl border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Upcoming Services
            </h2>
            <p className="text-gray-600">
              No services scheduled.
            </p>
          </div>

          <Link
            to="/services"
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Explore services →
          </Link>
        </div>
      </div>
    </div>
  );
}
