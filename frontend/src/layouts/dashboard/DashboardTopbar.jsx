import { Menu, Sun, Moon } from "lucide-react";
import Notifications from "../../components/Notifications";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardTopbar({ onMenuClick }) {
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--topbar-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 flex items-center px-4 md:px-6 z-10"
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3 p-2 rounded-xl transition"
        style={{ color: "var(--text2)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="p-2 rounded-xl transition"
          style={{ color: "var(--text2)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text2)"; }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Notifications />
      </div>
    </header>
  );
}