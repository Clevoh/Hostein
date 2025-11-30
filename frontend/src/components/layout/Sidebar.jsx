import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 p-5 flex flex-col">
      <h2 className="text-2xl font-bold text-blue-600 mb-10">Hostein</h2>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-3 rounded-lg font-medium ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `p-3 rounded-lg font-medium ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          Tenants
        </NavLink>

        <NavLink
          to="/properties"
          className={({ isActive }) =>
            `p-3 rounded-lg font-medium ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          Properties
        </NavLink>

        <NavLink
          to="/units"
          className={({ isActive }) =>
            `p-3 rounded-lg font-medium ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          Units
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
