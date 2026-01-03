import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <button
              onClick={clearAll}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
