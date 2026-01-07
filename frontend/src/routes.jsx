// frontend/src/routes.jsx
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import RequireRole from "./components/auth/RequireRole";

/* HOST */
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

/* CLIENT */
import ClientLayout from "./layouts/client/ClientLayout";
import ClientDashboardHome from "./pages/client/ClientDashboardHome";
import ClientBookings from "./pages/client/ClientBookings";
import ClientServices from "./pages/client/ClientServices";
import ClientProfile from "./pages/client/ClientProfile";

/* ADMIN */
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/UsersPage";
import AdminProperties from "./pages/admin/PropertiesPage";
import AdminReports from "./pages/admin/Reports";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* HOST */}
      <Route element={<RequireRole allowedRoles={["host"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />

          {/* PROPERTIES */}
          <Route path="properties" element={<PropertiesPage />} />

          {/*  UNITS — PROPERTY REQUIRED */}
          <Route
            path="properties/:propertyId/units"
            element={<UnitsPage />}
          />

          <Route path="tenants" element={<TenantsPage />} />
        </Route>
      </Route>

      {/* CLIENT */}
      <Route element={<RequireRole allowedRoles={["client"]} />}>
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboardHome />} />
          <Route path="bookings" element={<ClientBookings />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<RequireRole allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>

      <Route path="*" element={<h1>404 — Not Found</h1>} />
    </Routes>
  );
}
