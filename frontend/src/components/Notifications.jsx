// frontend/src/components/Notifications.jsx
// Clicking a booking/message notification now navigates to the correct page.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, CheckCircle, AlertCircle, Info, MessageCircle, Calendar } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    isConnected,
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case "success":  return <CheckCircle  size={18} className="text-green-500"  />;
      case "warning":  return <AlertCircle  size={18} className="text-yellow-500" />;
      case "booking":  return <Calendar     size={18} className="text-blue-500"   />;
      case "message":  return <MessageCircle size={18} className="text-purple-500" />;
      default:         return <Info         size={18} className="text-gray-400"   />;
    }
  };

  // Decide where to navigate based on notification type + current path
  const getDestination = (notification) => {
    const path = window.location.pathname;

    // Dashboard routes (host/landlord/admin)
    if (path.startsWith("/dashboard")) {
      if (notification.type === "booking" || notification.type === "success" || notification.type === "warning") {
        return "/dashboard/bookings";
      }
      if (notification.type === "message") {
        return "/dashboard/bookings"; // chat is opened from bookings
      }
      return "/dashboard";
    }

    // Client routes
    if (path.startsWith("/client")) {
      if (notification.type === "booking" || notification.type === "success" || notification.type === "warning") {
        return "/client/bookings";
      }
      if (notification.type === "message") {
        return "/client/bookings";
      }
      return "/client";
    }

    return null;
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowDropdown(false);

    const dest = getDestination(notification);
    if (dest) navigate(dest);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)   return "Just now";
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => {
          setShowDropdown((prev) => !prev);
          if (!showDropdown && unreadCount > 0) markAllAsRead();
        }}
        className="relative p-2 rounded-xl transition"
        style={{ color: "var(--text2)" }}
        title={isConnected ? "Notifications (connected)" : "Notifications (disconnected)"}
      >
        <Bell size={22} />

        {/* Offline dot */}
        {!isConnected && (
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border z-20 flex flex-col overflow-hidden"
               style={{ background: "var(--surface)", borderColor: "var(--border)", maxHeight: 480 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                 style={{ borderColor: "var(--border)", background: "var(--surface2, var(--bg))" }}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>Notifications</span>
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                      title={isConnected ? "Connected" : "Disconnected"} />
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button onClick={clearAll}
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                  Clear all
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <Bell size={40} className="text-gray-300" />
                  <p className="text-sm font-medium" style={{ color: "var(--text2)" }}>No notifications</p>
                  <p className="text-xs" style={{ color: "var(--text2)", opacity: 0.6 }}>You're all caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition group"
                    style={{
                      borderColor:    "var(--border)",
                      background:     !n.read ? "var(--surface2, rgba(59,130,246,0.04))" : "transparent",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2, rgba(0,0,0,0.03))"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = !n.read ? "var(--surface2, rgba(59,130,246,0.04))" : "transparent"; }}
                  >
                    {/* Unread dot */}
                    <div className="flex-shrink-0 mt-0.5">
                      {!n.read
                        ? <span className="block w-2 h-2 rounded-full bg-blue-500 mt-1" />
                        : <span className="block w-2 h-2" />
                      }
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text)" }}>
                        {n.title}
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text2)" }}>
                        {n.message}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--text2)", opacity: 0.6 }}>
                        {timeAgo(n.timestamp)}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      style={{ color: "var(--text2)" }}
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}