import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  LogOut,
  X,
} from "lucide-react";

export default function DashboardSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItem =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition";

  const navActive = "bg-blue-50 text-blue-600";
  const navInactive = "text-gray-700 hover:bg-gray-100";

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        lg:hidden`}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold">Hostein</h1>
          <button onClick={onClose} className="lg:hidden">
            <X />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? navActive : navInactive}`
            }
          >
            <LayoutDashboard size={18} />
            Overview
          </NavLink>

          <NavLink
            to="/dashboard/properties"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? navActive : navInactive}`
            }
          >
            <Building2 size={18} />
            Properties
          </NavLink>

          <NavLink
            to="/dashboard/units"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? navActive : navInactive}`
            }
          >
            <Home size={18} />
            Units
          </NavLink>

          <NavLink
            to="/dashboard/tenants"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? navActive : navInactive}`
            }
          >
            <Users size={18} />
            Tenants
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="border-t p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-600 w-full px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
