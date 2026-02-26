import { useEffect, useState } from "react";
import { Calendar, Clock, User, Check, X, MapPin } from "lucide-react";

export default function ServiceProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, completed, cancelled
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/service-provider/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await fetch(`http://localhost:5000/api/service-provider/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-orange-100 text-orange-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Bookings</h2>
        <p className="text-gray-500 mt-1">Manage your service requests</p>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === tab.value
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-2">
                ({bookings.filter(b => b.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {filter === "all" ? "You haven't received any bookings yet" : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{booking.service?.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{booking.service?.category}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">${booking.service?.price}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.client?.name}</p>
                    <p className="text-xs">{booking.client?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs">Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.scheduledTime}</p>
                    <p className="text-xs">Time</p>
                  </div>
                </div>
              </div>

              {booking.location && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <p>{booking.location}</p>
                </div>
              )}

              {booking.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600"><strong>Notes:</strong> {booking.notes}</p>
                </div>
              )}

              {/* ACTIONS */}
              {booking.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-medium transition"
                  >
                    <X size={16} />
                    Decline
                  </button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "completed")}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
