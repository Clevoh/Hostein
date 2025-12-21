import { NavLink } from "react-router-dom";
import { Home, Building2, Grid, Users, X } from "lucide-react";

export default function DashboardSidebar({ open, onClose }) {
  const navItem =
    "relative flex items-center gap-3 px-5 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition";

  const activeItem =
    "bg-blue-600 text-white shadow before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-800 before:rounded-r";

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
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Hostein</h1>

          {/* CLOSE BUTTON (MOBILE ONLY) */}
          <button onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Home size={20} />
            Overview
          </NavLink>

          <NavLink
            to="/dashboard/properties"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Building2 size={20} />
            Properties
          </NavLink>

          <NavLink
            to="/dashboard/units"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Grid size={20} />
            Units
          </NavLink>

          <NavLink
            to="/dashboard/tenants"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : ""}`
            }
          >
            <Users size={20} />
            Tenants
          </NavLink>
        </nav>
      </div>
    </>
  );
}
