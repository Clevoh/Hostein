import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../utils/logout";
import Notifications from "../../components/Notifications";
import { useNotifications } from "../../context/NotificationContext";

export default function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const pageTitleMap = {
    "/client": "Dashboard",
    "/client/bookings": "My Bookings",
    "/client/services": "My Services",
    "/client/profile": "My Profile",
  };

  const pageTitle = pageTitleMap[pathname] || "Client";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r px-6 py-8 flex-col">
        <h2 className="text-xl font-bold text-blue-600 mb-10">
          Hostein
        </h2>

        <nav className="flex flex-col space-y-4 text-sm">
          <NavLink to="/client" end className={navClass}>Dashboard</NavLink>
          <NavLink to="/client/bookings" className={navClass}>Bookings</NavLink>
          <NavLink to="/client/services" className={navClass}>Services</NavLink>
          <NavLink to="/client/profile" className={navClass}>Profile</NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP BAR */}
        <header className="h-14 md:h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <h1 className="font-semibold text-gray-800">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-4">
            <Notifications />
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* MOBILE NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-xs z-20">
          <NavLink to="/client" end className={navClass}>
            Home
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white px-1 rounded text-[10px]">
                {unreadCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/client/bookings" className={navClass}>Bookings</NavLink>
          <NavLink to="/client/services" className={navClass}>Services</NavLink>
          <NavLink to="/client/profile" className={navClass}>Profile</NavLink>
        </nav>
      </div>
    </div>
  );
}
