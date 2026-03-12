// frontend/src/routes.jsx
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// PUBLIC PAGES
import RentalsPage from "./pages/public/RentalsPage";
import PropertyDetailsPage from "./pages/public/PropertyDetailsPage";
import ServicesPage from "./pages/public/ServicesPage";
import ServiceDetailsPage from "./pages/public/ServiceDetailsPage";

import RequireRole from "./components/auth/RequireRole";

/* HOST */
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import PropertiesPage from "./pages/properties/PropertiesPage";
import AllUnitsPage from "./pages/units/AllUnitsPage";
import PropertyUnitsPage from "./pages/units/PropertyUnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

/* CLIENT */
import ClientLayout from "./layouts/client/ClientLayout";
import ClientDashboardHome from "./pages/client/ClientDashboardHome_API";
import ClientBookings from "./pages/client/ClientBookings_API";
import ClientServices from "./pages/client/ClientServices_API";
import ClientProfile from "./pages/client/ClientProfile_API";

/* SERVICE PROVIDER */
import ServiceProviderLayout from "./layouts/service-provider/ServiceProviderLayout";
import ServiceProviderDashboard from "./pages/service-provider/ServiceProviderDashboard";
import ServiceProviderEarnings from "./pages/service-provider/ServiceProviderEarnings";
import ServiceProviderBookingsPage from "./pages/service-provider/ServiceProviderBookingsPage";
import ServiceProviderProfile from "./pages/service-provider/ServiceProviderProfile";
import MyServicesPage from "./pages/service-provider/MyServicesPage";

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

      {/* PUBLIC RENTAL BROWSING */}
      <Route path="/rentals" element={<RentalsPage />} />
      <Route path="/apartments" element={<RentalsPage />} />
      <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />

      {/* 🆕 PUBLIC SERVICES BROWSING */}
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/service/:serviceId" element={<ServiceDetailsPage />} />

      {/* HOST */}
      <Route element={<RequireRole allowedRoles={["host"]} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="units" element={<AllUnitsPage />} />
          <Route path="properties/:propertyId/units" element={<PropertyUnitsPage />} />
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

      {/* SERVICE PROVIDER */}
      <Route element={<RequireRole allowedRoles={["service_provider"]} />}>
        <Route path="/service-provider" element={<ServiceProviderLayout />}>
          <Route index element={<ServiceProviderDashboard />} />
          <Route path="earnings" element={<ServiceProviderEarnings />} />
          <Route path="bookings" element={<ServiceProviderBookingsPage />} />
          <Route path="services" element={<MyServicesPage />} />
          <Route path="profile" element={<ServiceProviderProfile />} />
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
