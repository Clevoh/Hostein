import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ServiceProviderTopbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b z-30 flex items-center justify-between px-6">
      {/* MENU BUTTON (Mobile) */}
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu size={24} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-gray-500">Welcome back,</p>
        <p className="font-semibold">{user?.name || "Service Provider"}</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <span className="hidden md:block font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
