import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../utils/logout";
import Notifications from "../../components/Notifications";
import { useNotifications } from "../../context/NotificationContext";
import {
  Home,
  Calendar,
  Wrench,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageTitleMap = {
    "/client": "Dashboard",
    "/client/bookings": "My Bookings",
    "/client/services": "My Services",
    "/client/profile": "My Profile",
  };

  const pageTitle = pageTitleMap[pathname] || "Client Portal";

  const navItems = [
    {
      path: "/client",
      label: "Dashboard",
      icon: Home,
      end: true,
    },
    {
      path: "/client/bookings",
      label: "Bookings",
      icon: Calendar,
    },
    {
      path: "/client/services",
      label: "Services",
      icon: Wrench,
    },
    {
      path: "/client/profile",
      label: "Profile",
      icon: User,
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <div className="h-16 flex items-center px-6 border-b">
            <h2 className="text-2xl font-bold text-blue-600">
              Hostein
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* LOGOUT BUTTON */}
          <div className="p-3 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-xl font-semibold text-gray-900">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Notifications />
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30">
          <div className="grid grid-cols-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center py-3 gap-1 transition-colors relative ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-b-full" />
                      )}
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                      {item.path === "/client" && unreadCount > 0 && (
                        <span className="absolute top-2 right-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
