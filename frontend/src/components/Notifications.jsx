import { Bell } from "lucide-react";
import { useState } from "react";

const notifications = [
  { id: 1, text: "New tenant added to Unit A12" },
  { id: 2, text: "Rent payment received (KSH 8,000)" },
  { id: 3, text: "Unit B03 is now vacant" },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border z-50">
          <div className="p-4 border-b font-semibold">
            Notifications
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="px-4 py-3 text-sm hover:bg-gray-50 border-b"
              >
                {n.text}
              </div>
            ))}
          </div>

          <div className="p-3 text-center text-sm text-blue-600 cursor-pointer hover:bg-gray-50">
            View all
          </div>
        </div>
      )}
    </div>
  );
}
