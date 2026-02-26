import { NavLink } from "react-router-dom";
import { Home, Wrench, Calendar, DollarSign, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ServiceProviderSidebar({ open, onClose }) {
  const { logout } = useAuth();

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 transition";

  const activeItem =
    "bg-green-600 text-white shadow";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div>
            <h1 className="text-xl font-bold">Hostein</h1>
            <p className="text-xs text-gray-500">Service Provider</p>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/service-provider"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Home size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/service-provider/services"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Wrench size={18} /> My Services
          </NavLink>

          <NavLink
            to="/service-provider/bookings"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Calendar size={18} /> Bookings
          </NavLink>

          <NavLink
            to="/service-provider/earnings"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <DollarSign size={18} /> Earnings
          </NavLink>

          <NavLink
            to="/service-provider/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Settings size={18} /> Profile
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-600 w-full px-4 py-3 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
