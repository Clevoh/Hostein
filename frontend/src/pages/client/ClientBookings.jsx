// src/pages/client/ClientBookings.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function ClientBookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [bookings] = useState([
    {
      id: 1,
      property: "Modern Studio Apartment",
      location: "Downtown, City Center",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
      checkIn: "Feb 15, 2026",
      checkOut: "Feb 20, 2026",
      nights: 5,
      amount: 850,
      status: "confirmed",
      bookingDate: "Jan 25, 2026",
      propertyType: "Studio",
    },
    {
      id: 2,
      property: "Luxury Beach House",
      location: "Coastal Area, Beach Front",
      image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=600",
      checkIn: "Mar 10, 2026",
      checkOut: "Mar 15, 2026",
      nights: 5,
      amount: 2400,
      status: "pending",
      bookingDate: "Jan 28, 2026",
      propertyType: "House",
    },
    {
      id: 3,
      property: "Cozy City Apartment",
      location: "Midtown, Arts District",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
      checkIn: "Jan 10, 2026",
      checkOut: "Jan 15, 2026",
      nights: 5,
      amount: 650,
      status: "completed",
      bookingDate: "Dec 20, 2025",
      propertyType: "Apartment",
    },
    {
      id: 4,
      property: "Urban Loft Space",
      location: "Industrial District",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600",
      checkIn: "Dec 5, 2025",
      checkOut: "Dec 8, 2025",
      nights: 3,
      amount: 450,
      status: "cancelled",
      bookingDate: "Nov 15, 2025",
      propertyType: "Loft",
    },
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        icon: CheckCircle,
        text: "Confirmed",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      pending: {
        icon: Clock,
        text: "Pending",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      completed: {
        icon: CheckCircle,
        text: "Completed",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      cancelled: {
        icon: XCircle,
        text: "Cancelled",
        className: "bg-red-100 text-red-700 border-red-200",
      },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
      >
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" &&
        (booking.status === "confirmed" || booking.status === "pending")) ||
      (activeTab === "past" &&
        (booking.status === "completed" || booking.status === "cancelled"));

    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: "all", label: "All Bookings", count: bookings.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: bookings.filter(
        (b) => b.status === "confirmed" || b.status === "pending"
      ).length,
    },
    {
      id: "past",
      label: "Past",
      count: bookings.filter(
        (b) => b.status === "completed" || b.status === "cancelled"
      ).length,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your property bookings
          </p>
        </div>

        <Link
          to="/rentals"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Home size={18} />
          Find a Home
        </Link>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search bookings by property or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* IMAGE */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={booking.image}
                    alt={booking.property}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {booking.property}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin size={16} />
                        {booking.location}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-in</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {booking.checkIn}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-out</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {booking.checkOut}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {booking.nights} nights
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <DollarSign size={14} className="text-gray-400" />
                        ${booking.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Booked on {booking.bookingDate}
                    </span>
                    <span className="text-sm text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {booking.propertyType}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    {booking.status === "confirmed" && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Modify Booking
                      </button>
                    )}
                    {booking.status === "pending" && (
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery
              ? "No bookings found"
              : activeTab === "upcoming"
              ? "No upcoming bookings"
              : activeTab === "past"
              ? "No past bookings"
              : "No bookings yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Start exploring amazing properties and make your first booking"}
          </p>

          <Link
            to="/rentals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={18} />
            Browse Available Homes
          </Link>
        </div>
      )}
    </div>
  );
}
