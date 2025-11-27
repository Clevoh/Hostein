import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-6 font-bold text-xl border-b border-gray-700">
        Hostein
      </div>
      <nav className="mt-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 rounded ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 rounded ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Tenants
        </NavLink>
        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 rounded ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Properties
        </NavLink>
        <NavLink
          to="/units"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 rounded ${
              isActive ? "bg-gray-700" : ""
            }`
          }
        >
          Units
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
