// src/pages/client/ClientBookings.jsx
import { Link } from "react-router-dom";

export default function ClientBookings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      <div className="bg-white rounded-xl border p-8 text-center space-y-4">
        <p className="text-gray-600">
          You don’t have any bookings yet.
        </p>

        <Link
          to="/rentals"
          className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse available homes
        </Link>
      </div>
    </div>
  );
}
