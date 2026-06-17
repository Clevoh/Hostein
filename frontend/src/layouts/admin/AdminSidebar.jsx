// src/Layouts/admin/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { X, LayoutDashboard, Users, Home, FileText, ShieldCheck, LogOut } from "lucide-react";
import { logout } from "../../utils/logout";

const NAV_ITEMS = [
  { to: "/admin",            icon: LayoutDashboard, label: "Overview",   end: true },
  { to: "/admin/users",      icon: Users,           label: "Users" },
  { to: "/admin/properties", icon: Home,            label: "Properties" },
  { to: "/admin/reports",    icon: FileText,        label: "Reports" },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .adm-sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--surface);
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        /* Decorative top accent bar */
        .adm-sidebar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ef4444 100%);
          background-size: 200% 100%;
          animation: shimmer-bar 3s linear infinite;
        }
        @keyframes shimmer-bar {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Logo area */
        .adm-logo-wrap {
          padding: 28px 24px 20px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .adm-logo-wordmark {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .adm-logo-wordmark span {
          color: #ef4444;
        }
        .adm-logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.18);
          padding: 3px 9px;
          border-radius: 100px;
        }

        /* Section label */
        .adm-nav-section {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text2);
          opacity: 0.5;
          padding: 0 24px;
          margin-bottom: 8px;
          margin-top: 4px;
        }

        /* Nav */
        .adm-nav {
          flex: 1;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .adm-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          color: var(--text2);
          transition: all 0.18s ease;
          position: relative;
          letter-spacing: 0.01em;
        }
        .adm-nav-link:hover {
          background: var(--bg);
          color: var(--text);
        }
        .adm-nav-link.active {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          font-weight: 600;
        }
        .adm-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: #ef4444;
          border-radius: 0 3px 3px 0;
        }
        .adm-nav-link .adm-nav-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg);
          transition: background 0.18s;
          flex-shrink: 0;
        }
        .adm-nav-link:hover .adm-nav-icon,
        .adm-nav-link.active .adm-nav-icon {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Footer */
        .adm-sidebar-footer {
          border-top: 1px solid var(--border);
          padding: 14px;
          flex-shrink: 0;
        }
        .adm-system-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          background: var(--bg);
          margin-bottom: 8px;
        }
        .adm-system-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
          flex-shrink: 0;
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        .adm-system-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          flex: 1;
        }
        .adm-system-sub {
          font-size: 10px;
          color: var(--text2);
          font-weight: 400;
        }
        .adm-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--text2);
          transition: all 0.18s;
        }
        .adm-logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
        }

        /* Close btn (mobile) */
        .adm-close-btn {
          position: absolute;
          top: 14px; right: 14px;
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text2);
          transition: all 0.15s;
        }
        .adm-close-btn:hover {
          background: var(--bg);
          color: var(--text);
        }
      `}</style>

      <div className="adm-sidebar">
        {onClose && (
          <button onClick={onClose} className="adm-close-btn lg:hidden">
            <X size={14} />
          </button>
        )}

        {/* Logo */}
        <div className="adm-logo-wrap">
          <div className="adm-logo-wordmark">Hostein<span>.</span></div>
          <div className="adm-logo-badge">
            <ShieldCheck size={9} />
            Admin Console
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          <div className="adm-nav-section">Navigation</div>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `adm-nav-link${isActive ? " active" : ""}`}
            >
              <div className="adm-nav-icon">
                <Icon size={16} />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-footer">
          <div className="adm-system-row">
            <div className="adm-system-dot" />
            <div>
              <div className="adm-system-label">System Online</div>
              <div className="adm-system-sub">All services running</div>
            </div>
          </div>
          <button onClick={handleLogout} className="adm-logout-btn">
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-20"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 z-30 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}