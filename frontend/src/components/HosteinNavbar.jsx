import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function HosteinNavbar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isTransparent = isLanding && !scrolled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Syne:wght@500;600;700&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .nav-root.transparent {
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: none;
        }
        .nav-root.solid {
          background: var(--topbar-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--topbar-border);
          box-shadow: 0 2px 20px rgba(0,0,0,0.06);
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-root.transparent .nav-logo { color: #F4F1EC; }
        .nav-root.solid .nav-logo { color: var(--text); }

        .nav-link {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .nav-root.transparent .nav-link { color: rgba(244,241,236,0.6); }
        .nav-root.transparent .nav-link:hover { color: #F4F1EC; background: rgba(255,255,255,0.07); }
        .nav-root.solid .nav-link { color: var(--text2); }
        .nav-root.solid .nav-link:hover { color: var(--text); background: var(--surface2); }

        .nav-btn-filled {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 9px 22px;
          border-radius: 100px;
          background: var(--accent);
          color: #0A0A0F;
          transition: opacity 0.2s, transform 0.15s;
          border: none;
          cursor: pointer;
          display: inline-block;
        }
        .nav-btn-filled:hover { opacity: 0.85; transform: translateY(-1px); }

        .nav-logout {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          background: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .nav-root.transparent .nav-logout { color: rgba(244,241,236,0.45); }
        .nav-root.transparent .nav-logout:hover { color: #ff6b6b; background: rgba(255,107,107,0.1); }
        .nav-root.solid .nav-logout { color: var(--text2); }
        .nav-root.solid .nav-logout:hover { color: #dc2626; background: rgba(220,38,38,0.06); }

        .nav-icon-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }
        .nav-root.transparent .nav-icon-btn {
          border-color: rgba(244,241,236,0.2);
          color: rgba(244,241,236,0.7);
        }
        .nav-root.transparent .nav-icon-btn:hover {
          border-color: rgba(244,241,236,0.45);
          background: rgba(255,255,255,0.07);
          color: #F4F1EC;
        }
        .nav-root.solid .nav-icon-btn {
          border-color: var(--border);
          color: var(--text2);
        }
        .nav-root.solid .nav-icon-btn:hover {
          border-color: var(--text2);
          background: var(--surface2);
          color: var(--text);
        }

        /* hamburger reuses nav-icon-btn — keep for mobile */
        .hamburger-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }
        .nav-root.transparent .hamburger-btn {
          border-color: rgba(244,241,236,0.2);
          color: #F4F1EC;
        }
        .nav-root.transparent .hamburger-btn:hover {
          border-color: rgba(244,241,236,0.4);
          background: rgba(255,255,255,0.07);
        }
        .nav-root.solid .hamburger-btn {
          border-color: var(--border);
          color: var(--text);
        }
        .nav-root.solid .hamburger-btn:hover {
          border-color: var(--text2);
          background: var(--surface2);
        }

        /* Mobile drawer — uses CSS variables so it adapts to dark/light */
        .mobile-drawer {
          position: fixed;
          inset-y: 0; right: 0;
          z-index: 200;
          width: 300px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          display: flex;
          flex-direction: column;
        }
        .mobile-drawer.open { transform: translateX(0); }

        .drawer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
        }

        .drawer-link {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text2);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
          transition: color 0.2s;
          display: block;
        }
        .drawer-link:hover { color: var(--accent); }

        .drawer-btn {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          background: none;
          padding: 14px 0;
          text-align: left;
          transition: color 0.2s;
          width: 100%;
          color: var(--text2);
        }
        .drawer-btn:hover { color: #f87171; }

        .drawer-footer-text {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text2);
          opacity: 0.5;
        }
      `}</style>

      <nav className={`nav-root ${isTransparent ? "transparent" : "solid"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link to="/" className="nav-logo flex-shrink-0">
            Hostein
          </Link>

          {/* CENTER — optional search bar slot */}
          {children && (
            <div className="hidden lg:flex flex-1 justify-center px-4 max-w-2xl">
              {children}
            </div>
          )}

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-1">
            {!user && (
              <Link to="/signup" className="nav-link">Become a host</Link>
            )}

            <LanguageCurrencyDropdown />

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="nav-icon-btn"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {!user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-btn-filled">Sign up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="hamburger-btn md:hidden"
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span className="drawer-logo">Hostein</span>
          <div className="flex items-center gap-2">
            {/* Theme toggle inside drawer */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="nav-icon-btn"
              style={{ width: 32, height: 32 }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="nav-icon-btn"
              style={{ width: 32, height: 32 }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 px-7 py-6 space-y-0">
          <Link to="/" onClick={() => setMobileOpen(false)} className="drawer-link">Home</Link>
          <Link to="/rentals" onClick={() => setMobileOpen(false)} className="drawer-link">Browse Rentals</Link>
          <Link to="/services" onClick={() => setMobileOpen(false)} className="drawer-link">Services</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="drawer-link">Login</Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="drawer-link"
                style={{ color: "var(--accent)" }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="drawer-btn"
            >
              Logout
            </button>
          )}
        </div>

        <div
          className="px-7 py-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="drawer-footer-text">
            East Africa's property platform
          </p>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[150] backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />
      )}
    </>
  );
}