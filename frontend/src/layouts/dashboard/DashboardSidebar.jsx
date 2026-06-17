import { NavLink } from "react-router-dom";
import {
  Home, Building2, Grid3x3, Users, LogOut, X, Calendar, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/dashboard",            label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/dashboard/properties", label: "Properties",  icon: Building2 },
  { to: "/dashboard/units",      label: "Units",       icon: Grid3x3 },
  { to: "/dashboard/bookings",   label: "Bookings",    icon: Calendar },
  { to: "/dashboard/tenants",    label: "Tenants",     icon: Users },
];

export default function DashboardSidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
      )}

      <aside
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
          className="h-16 flex items-center justify-between px-5 flex-shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Home size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--sidebar-text-active)" }}>
              Hostein
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition"
            style={{ color: "var(--sidebar-text)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p
            className="text-xs font-semibold uppercase tracking-wider px-3 mb-2 mt-2"
            style={{ color: "var(--sidebar-text)", opacity: 0.5 }}
          >
            Navigation
          </p>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={({ isActive }) => ({
                background: isActive ? "var(--sidebar-active-bg)" : "transparent",
                color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "var(--sidebar-hover-bg)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.dataset.active) {
                  e.currentTarget.style.background = "";
                }
              }}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="p-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sidebar-text)"; e.currentTarget.style.background = ""; }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}