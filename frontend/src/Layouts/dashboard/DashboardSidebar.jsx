import { NavLink } from "react-router-dom";
import { Home, Building2, Grid, Users } from "lucide-react";

export default function DashboardSidebar() {
  const navItem =
    "flex items-center gap-3 px-5 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition";

  const activeItem = "bg-blue-600 text-white";

  return (
    <div className="w-64 fixed h-full bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-8">Hostein</h1>

      <nav className="flex flex-col gap-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          <Home size={20} /> Overview
        </NavLink>

        <NavLink
          to="/dashboard/properties"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          <Building2 size={20} /> Properties
        </NavLink>

        <NavLink
          to="/dashboard/units"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          <Grid size={20} /> Units
        </NavLink>

        <NavLink
          to="/dashboard/tenants"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : ""}`
          }
        >
          <Users size={20} /> Tenants
        </NavLink>

      </nav>
    </div>
  );
}
