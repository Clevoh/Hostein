// frontend/src/pages/dashboard/HostBookings.jsx

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Home,
  DollarSign,
  Clock,
  AlertCircle,
  Trash2,
  MoreVertical,
  Edit,
  RefreshCw,
} from "lucide-react";

import PropertyChatWindow from "../../components/chat/PropertyChatWindow";

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [chatBooking, setChatBooking] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showMoreMenu, setShowMoreMenu] = useState(null);
  const [renewBooking, setRenewBooking] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchHostBookings();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filter, bookings]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMoreMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setCurrentUserId(data._id);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const fetchHostBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/bookings/host-bookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      const bookingsList = data.bookings || data;
      setBookings(Array.isArray(bookingsList) ? bookingsList : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filter));
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking confirmed successfully!");
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to confirm booking");
      }
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      alert("Failed to confirm booking");
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("⚠️ Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking cancelled successfully!");
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking");
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("🗑️ Permanently delete this booking? This cannot be undone.")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking deleted successfully!");
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("Failed to delete booking");
    }
  };

  const markAsPaid = async (bookingId) => {
    if (!confirm("💵 Mark this booking as PAID?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: "paid" }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking marked as paid!");
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      alert("Failed to update payment status");
    }
  };

  const markAsCompleted = async (bookingId) => {
    if (!confirm("✅ Mark this booking as COMPLETED? (Guest has checked out)")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking marked as completed!");
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to complete booking");
      }
    } catch (error) {
      console.error("Failed to complete booking:", error);
      alert("Failed to complete booking");
    }
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCheckOut = formData.get("checkOut");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${renewBooking._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checkOut: newCheckOut }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Booking renewed successfully!");
        setRenewBooking(null);
        fetchHostBookings();
      } else {
        alert(data.message || "Failed to renew booking");
      }
    } catch (error) {
      console.error("Failed to renew booking:", error);
      alert("Failed to renew booking");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    const icons = {
      pending: <Clock size={14} />,
      confirmed: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />,
      completed: <CheckCircle size={14} />,
    };
    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {icons[status]}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const styles = {
      unpaid: "bg-red-100 text-red-800",
      partial: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
    };
    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          styles[paymentStatus] || "bg-gray-100 text-gray-800"
        }`}
      >
        <DollarSign size={14} />
        <span className="capitalize">{paymentStatus}</span>
      </div>
    );
  };

  const isExpired = (checkOut) => new Date(checkOut) < new Date();

  const inputStyle = {
    borderColor: "var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: "var(--text2)" }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              Property Bookings
            </h1>
            <p className="mt-1" style={{ color: "var(--text2)" }}>
              Manage bookings for your properties
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div
          className="flex gap-2 border-b overflow-x-auto"
          style={{ borderColor: "var(--border)" }}
        >
          {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
                filter === status
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
              style={{ color: filter === status ? undefined : "var(--text2)" }}
            >
              <span className="capitalize">{status}</span>
              <span className="ml-2 text-sm" style={{ color: "var(--text2)" }}>
                (
                {status === "all"
                  ? bookings.length
                  : bookings.filter((b) => b.status === status).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* BOOKINGS */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div
              className="text-center py-16 rounded-xl"
              style={{ background: "var(--bg)" }}
            >
              <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                No {filter !== "all" ? filter : ""} bookings
              </h3>
              <p style={{ color: "var(--text2)" }}>
                {filter === "pending"
                  ? "No pending bookings at the moment"
                  : "Your bookings will appear here"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-xl p-6 hover:shadow-lg transition"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Home size={20} style={{ color: "var(--text2)" }} />
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        {booking.property?.title || "Unknown Property"}
                      </h3>
                      {booking.status === "confirmed" &&
                        isExpired(booking.checkOut) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            ⏰ Expired
                          </span>
                        )}
                    </div>
                    <p className="text-sm" style={{ color: "var(--text2)" }}>
                      {booking.property?.address}, {booking.property?.city}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-end ml-4">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <div
                      className="flex items-center gap-1 text-xs mb-1"
                      style={{ color: "var(--text2)" }}
                    >
                      <User size={14} />
                      <span>Client</span>
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text)" }}>
                      {booking.client?.name || "Unknown"}
                    </div>
                    <div className="text-sm" style={{ color: "var(--text2)" }}>
                      {booking.client?.email}
                    </div>
                  </div>

                  <div>
                    <div
                      className="text-xs mb-1"
                      style={{ color: "var(--text2)" }}
                    >
                      Unit
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text)" }}>
                      {booking.unit?.unitNumber || "N/A"}
                    </div>
                    <div className="text-sm" style={{ color: "var(--text2)" }}>
                      {booking.unit?.unitType}
                    </div>
                  </div>

                  <div>
                    <div
                      className="flex items-center gap-1 text-xs mb-1"
                      style={{ color: "var(--text2)" }}
                    >
                      <Calendar size={14} />
                      <span>Check-in</span>
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text)" }}>
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text2)" }}>
                      Check-out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div
                      className="flex items-center gap-1 text-xs mb-1"
                      style={{ color: "var(--text2)" }}
                    >
                      <DollarSign size={14} />
                      <span>Total Amount</span>
                    </div>
                    <div className="font-semibold" style={{ color: "var(--text)" }}>
                      {booking.amount?.toLocaleString() || "0"} RWF
                    </div>
                    <div className="text-sm" style={{ color: "var(--text2)" }}>
                      {booking.nights || 0}{" "}
                      {booking.nights === 1 ? "night" : "nights"}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div
                    className="mt-4 p-3 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  </div>
                )}

                {/* ── ACTION BUTTONS ── */}
                <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-2" style={{ borderColor: "var(--border)" }}>

                  {/* Confirm — only for pending bookings */}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => confirmBooking(booking._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                    >
                      <CheckCircle size={15} />
                      Confirm
                    </button>
                  )}

                  {/* Cancel — pending or confirmed */}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition"
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>
                  )}

                  {/* Mark as Paid — when not yet paid */}
                  {booking.paymentStatus !== "paid" && booking.status !== "cancelled" && (
                    <button
                      onClick={() => markAsPaid(booking._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition"
                    >
                      <DollarSign size={15} />
                      Mark Paid
                    </button>
                  )}

                  {/* Mark as Completed — only confirmed bookings */}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => markAsCompleted(booking._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-lg transition"
                    >
                      <CheckCircle size={15} />
                      Complete
                    </button>
                  )}

                  {/* Renew / Extend — confirmed bookings (especially expired ones) */}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => setRenewBooking(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm font-medium rounded-lg transition"
                    >
                      <RefreshCw size={15} />
                      Renew
                    </button>
                  )}

                  {/* Message / Chat — always available */}
                  <button
                    onClick={() => setChatBooking(booking)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium rounded-lg transition"
                  >
                    <MessageCircle size={15} />
                    Message
                  </button>

                  {/* More actions — delete (always) */}
                  <div className="relative ml-auto" ref={showMoreMenu === booking._id ? menuRef : null}>
                    <button
                      onClick={() =>
                        setShowMoreMenu(
                          showMoreMenu === booking._id ? null : booking._id
                        )
                      }
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-sm transition"
                      style={{ color: "var(--text2)" }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showMoreMenu === booking._id && (
                      <div
                        className="absolute right-0 mt-1 w-44 rounded-xl shadow-xl border z-30 overflow-hidden"
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                        }}
                      >
                        <button
                          onClick={() => {
                            setShowMoreMenu(null);
                            deleteBooking(booking._id);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={15} />
                          Delete Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* ── END ACTION BUTTONS ── */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RENEW MODAL */}
      {renewBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-xl p-6 max-w-md w-full"
            style={{ background: "var(--surface)" }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              Renew / Extend Booking
            </h3>
            <p className="mb-4" style={{ color: "var(--text2)" }}>
              Current checkout:{" "}
              {new Date(renewBooking.checkOut).toLocaleDateString()}
            </p>
            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--text)" }}
                >
                  New Checkout Date
                </label>
                <input
                  type="date"
                  name="checkOut"
                  min={renewBooking.checkOut.split("T")[0]}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRenewBooking(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAT */}
      {chatBooking && currentUserId && (
        <PropertyChatWindow
          booking={chatBooking}
          currentUserId={currentUserId}
          onClose={() => setChatBooking(null)}
        />
      )}
    </>
  );
}