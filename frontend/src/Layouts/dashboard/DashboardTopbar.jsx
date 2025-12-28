import { Menu } from "lucide-react";
import Notifications from "../../components/Notifications";

export default function DashboardTopbar({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b flex items-center px-4 md:px-6 z-30">
      {/* MOBILE MENU */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3"
      >
        <Menu />
      </button>

      {/* TITLE */}
      <h1 className="font-semibold text-gray-800">
        Host Dashboard
      </h1>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-4">
        <Notifications />
      </div>
    </header>
  );
}
