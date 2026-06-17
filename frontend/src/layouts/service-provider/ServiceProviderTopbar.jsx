import { Menu, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ServiceProviderTopbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 flex items-center justify-between px-4 md:px-6 backdrop-blur-md"
      style={{
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--topbar-border)",
      }}
    >
      {/* Left — mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl transition"
        style={{ color: "var(--text2)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title (desktop) */}
      <span
        className="hidden lg:block text-sm font-semibold"
        style={{ color: "var(--text)" }}
      >
        Service Provider Portal
      </span>

      {/* Right — actions */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl transition text-sm font-medium w-9 h-9 flex items-center justify-center"
          style={{ color: "var(--text2)", background: "var(--surface2)" }}
          aria-label="Toggle theme"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl transition w-9 h-9 flex items-center justify-center"
          style={{ color: "var(--text2)", background: "var(--surface2)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}
          aria-label="Notifications"
        >
          <Bell size={17} />
          {/* Unread dot — remove if using a real count */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface2)]" />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          title={user?.name}
        >
          {user?.name?.[0]?.toUpperCase() ?? "P"}
        </div>
      </div>
    </header>
  );
}