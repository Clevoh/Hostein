import { NavLink } from "react-router-dom";
import { Home, Wrench, Calendar, DollarSign, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/service-provider",          label: "Dashboard",   icon: Home,       end: true },
  { to: "/service-provider/services", label: "My Services", icon: Wrench },
  { to: "/service-provider/bookings", label: "Bookings",    icon: Calendar },
  { to: "/service-provider/earnings", label: "Earnings",    icon: DollarSign },
  { to: "/service-provider/profile",  label: "Profile",     icon: Settings },
];

export default function ServiceProviderSidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.45)" }}
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
          className="h-16 flex items-center justify-between px-5 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Wrench size={14} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block" style={{ color: "var(--sidebar-text-active)" }}>Hostein</span>
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--sidebar-text)", opacity: 0.5 }}>Provider</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition"
            style={{ color: "var(--sidebar-text)" }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p
            className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2 mt-2"
            style={{ color: "var(--sidebar-text)", opacity: 0.4 }}
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
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--sidebar-text)"; e.currentTarget.style.background = ""; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
