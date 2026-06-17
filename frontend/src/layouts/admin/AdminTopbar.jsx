import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, Sun, Moon, ShieldCheck, ChevronRight } from "lucide-react";
import { logout } from "../../utils/logout";
import { useTheme } from "../../context/ThemeContext";

const BREADCRUMB_MAP = {
  "/admin":            "Overview",
  "/admin/users":      "Users",
  "/admin/properties": "Properties",
  "/admin/reports":    "Reports",
};

export default function AdminTopbar({ onMenuClick }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme, toggle } = useTheme();

  const currentPage = BREADCRUMB_MAP[location.pathname] || "Dashboard";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .adm-topbar {
          font-family: 'DM Sans', sans-serif;
        }
        .adm-topbar-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none; background: transparent; cursor: pointer;
          color: var(--text2);
          transition: all 0.18s;
        }
        .adm-topbar-btn:hover {
          background: var(--bg);
          color: var(--text);
        }
        .adm-logout-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.06);
          color: #ef4444;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.18s;
        }
        .adm-logout-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.45);
        }
        .adm-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 500;
          color: var(--text2);
        }
        .adm-breadcrumb-current {
          font-weight: 600;
          color: var(--text);
        }
        .adm-avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);
        }
        .adm-divider {
          width: 1px; height: 22px;
          background: var(--border);
          margin: 0 4px;
        }
      `}</style>

      <header
        className="adm-topbar fixed top-0 left-0 lg:left-64 right-0 h-16 z-20 flex items-center justify-between px-4 md:px-6"
        style={{
          background: "var(--topbar-bg, var(--surface))",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="adm-topbar-btn lg:hidden">
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="adm-breadcrumb">
            <span className="hidden sm:inline">Admin</span>
            <ChevronRight size={14} className="hidden sm:block opacity-40" />
            <span className="adm-breadcrumb-current">{currentPage}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="adm-topbar-btn"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="adm-divider" />

          {/* Logout */}
          <button onClick={handleLogout} className="adm-logout-btn">
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>

          {/* Admin avatar */}
          <div className="adm-avatar">
            <ShieldCheck size={16} />
          </div>
        </div>
      </header>
    </>
  );
}