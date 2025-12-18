// src/Layouts/admin/AdminTopbar.jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout";

export default function AdminTopbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-10">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>

        <div className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}
