import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardTopbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b flex items-center justify-end px-6">
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="text-red-600 font-medium"
      >
        Logout
      </button>
    </div>
  );
}
