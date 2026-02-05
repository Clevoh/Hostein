// src/pages/client/ClientBookings.jsx
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { getMyBookings, cancelBooking } from "../../services/bookingService";

export default function ClientBookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);
      await loadBookings(); // Reload bookings
    } catch (error) {
      alert("Failed to cancel booking: " + (error.response?.data?.message || error.message));
    }
  };

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

    const badge = badges[status] || badges.pending;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property?.city?.toLowerCase().includes(searchQuery.toLowerCase());

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

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
              key={booking._id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* IMAGE */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={getImageUrl(booking.property?.images?.[0])}
                    alt={booking.property?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {booking.property?.title || "Property"}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin size={16} />
                        {booking.property?.city || "Location"}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-in</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Check-out</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(booking.checkOut)}
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
                      Booked on {formatDate(booking.bookingDate || booking.createdAt)}
                    </span>
                    {booking.unit && (
                      <>
                        <span className="text-sm text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Unit {booking.unit.unitNumber}
                        </span>
                      </>
                    )}
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
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
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
