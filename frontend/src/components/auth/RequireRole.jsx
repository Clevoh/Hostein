import { Navigate } from "react-router-dom";

export default function RequireRole({ role, children }) {
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
