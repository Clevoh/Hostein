import { useEffect, useState } from "react";
import { Calendar, Clock, User, Check, X, MapPin, MessageCircle } from "lucide-react";
import ChatWindow from "../../components/chat/ChatWindow";

const API_URL = import.meta.env.VITE_API_URL;

export default function ServiceProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [chatBooking, setChatBooking] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setCurrentUserId(data._id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-provider/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      console.log("Bookings received:", data);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await fetch(`${API_URL}/api/service-provider/bookings/${bookingId}/status`, {
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
      pending:      "bg-orange-100 text-orange-700",
      confirmed:    "bg-blue-100 text-blue-700",
      "in-progress":"bg-purple-100 text-purple-700",
      completed:    "bg-green-100 text-green-700",
      cancelled:    "bg-red-100 text-red-700",
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
        <h2 className="text-3xl font-bold" style={{ color: "var(--text)" }}>Bookings</h2>
        <p className="mt-1" style={{ color: "var(--text2)" }}>Manage your service requests</p>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {[
          { value: "all",         label: "All" },
          { value: "pending",     label: "Pending" },
          { value: "confirmed",   label: "Confirmed" },
          { value: "in-progress", label: "In Progress" },
          { value: "completed",   label: "Completed" },
          { value: "cancelled",   label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === tab.value
                ? "bg-green-600 text-white"
                : "hover:opacity-80"
            }`}
            style={filter !== tab.value ? { background: "var(--bg)", color: "var(--text)" } : {}}
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
        <div
          className="text-center py-20 rounded-xl border-2 border-dashed"
          style={{ background: "var(--surface)" }}
        >
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>No bookings found</h3>
          <p style={{ color: "var(--text2)" }}>
            {filter === "all" ? "You haven't received any bookings yet" : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl p-6 shadow-sm border hover:shadow-md transition"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: "var(--text)" }}>
                      {booking.serviceType || booking.serviceOffering?.name || "Service"}
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>
                    {booking.category || booking.serviceOffering?.category || "General"}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
                  {booking.price?.toLocaleString()} {booking.currency || "KES"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text2)" }}>
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text)" }}>{booking.client?.name || "Client"}</p>
                    <p className="text-xs">{booking.client?.email || ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text2)" }}>
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text)" }}>
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs">Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text2)" }}>
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium" style={{ color: "var(--text)" }}>{booking.scheduledTime}</p>
                    <p className="text-xs">Time</p>
                  </div>
                </div>
              </div>

              {booking.duration && (
                <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text2)" }}>
                  <Clock size={16} className="text-gray-400" />
                  <p><strong>Duration:</strong> {booking.duration}</p>
                </div>
              )}

              {booking.location && (
                <div className="flex items-start gap-2 text-sm mb-4" style={{ color: "var(--text2)" }}>
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <p>{booking.location}</p>
                </div>
              )}

              {booking.notes && (
                <div className="rounded-lg p-3 mb-4" style={{ background: "var(--bg)" }}>
                  <p className="text-sm" style={{ color: "var(--text2)" }}>
                    <strong style={{ color: "var(--text)" }}>Notes:</strong> {booking.notes}
                  </p>
                </div>
              )}

              {booking.description && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Service Details:</strong> {booking.description}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4 border-t flex-wrap" style={{ borderColor: "var(--border)" }}>
                {/* MESSAGE CLIENT - Always visible */}
                <button
                  onClick={() => setChatBooking(booking)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                >
                  <MessageCircle size={16} />
                  Message Client
                </button>

                {booking.status === "pending" && (
                  <>
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
                  </>
                )}

                {booking.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, "in-progress")}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
                    >
                      Start Job
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, "completed")}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                      className="px-4 py-2 border rounded-xl font-medium transition"
                      style={{ borderColor: "var(--border)", color: "var(--text)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {booking.status === "in-progress" && (
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "completed")}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHAT WINDOW */}
      {chatBooking && currentUserId && (
        <ChatWindow
          booking={chatBooking}
          currentUserId={currentUserId}
          onClose={() => setChatBooking(null)}
        />
      )}
    </div>
  );
}