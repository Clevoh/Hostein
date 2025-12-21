import { Menu } from "lucide-react";
import Notifications from "../../components/Notifications";

export default function DashboardTopbar({ onMenuClick }) {
  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b flex items-center px-6 z-10">
      {/* MOBILE MENU */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-4"
      >
        <Menu />
      </button>

      {/* PAGE TITLE */}
      <h1 className="font-semibold text-lg text-gray-800">
        Dashboard
      </h1>

      {/* RIGHT ACTIONS */}
      <div className="ml-auto flex items-center gap-4">
        <Notifications />
      </div>
    </div>
  );
}
