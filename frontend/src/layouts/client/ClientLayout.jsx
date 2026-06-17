import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../utils/logout";
import Notifications from "../../components/Notifications";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import { Home, Calendar, Wrench, User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";

const NAV = [
  { path: "/client",          label: "Dashboard", icon: Home,     end: true },
  { path: "/client/bookings", label: "Bookings",  icon: Calendar },
  { path: "/client/services", label: "Services",  icon: Wrench },
  { path: "/client/profile",  label: "Profile",   icon: User },
];

export default function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() { logout(); navigate("/login"); }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-5 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--sidebar-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Home size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--sidebar-text-active)" }}>
              Hostein
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg transition"
            style={{ color: "var(--sidebar-text)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2 mt-2"
            style={{ color: "var(--sidebar-text)", opacity: 0.5 }}>
            Menu
          </p>
          {NAV.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
              style={({ isActive }) => ({
                background: isActive ? "var(--sidebar-active-bg)" : "transparent",
                color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
              })}
            >
              <Icon size={17} />
              {label}
              {path === "/client" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-px rounded-full min-w-[18px] text-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition text-sm font-medium"
            style={{ color: "var(--sidebar-text)" }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30"
          style={{
            background: "var(--topbar-bg)",
            borderBottom: "1px solid var(--topbar-border)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl transition"
            style={{ color: "var(--text2)" }}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-xl transition"
              style={{ color: "var(--text2)" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Notifications />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
          <div className="grid grid-cols-4">
            {NAV.map(({ path, label, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className="flex flex-col items-center justify-center py-3 gap-1 transition-colors relative"
                style={({ isActive }) => ({
                  color: isActive ? "var(--accent)" : "var(--text2)",
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-b-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {label}
                    </span>
                    {path === "/client" && unreadCount > 0 && (
                      <span className="absolute top-2 right-[22%] bg-red-500 text-white text-[9px] font-bold px-1 py-px rounded-full min-w-[16px] text-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}