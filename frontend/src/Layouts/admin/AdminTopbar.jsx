// src/Layouts/admin/AdminTopbar.jsx
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { logout } from "../../utils/logout";

export default function AdminTopbar({ onMenuClick }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 z-20">
      {/* Left: Hamburger (Mobile) + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
        
        <div className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
