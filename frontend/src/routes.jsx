// src/routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* ---------------------- HOST DASHBOARD ---------------------- */
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

/* ---------------------- CLIENT DASHBOARD ---------------------- */
import ClientLayout from "./layouts/client/ClientLayout";
import ClientDashboardHome from "./pages/client/ClientDashboardHome";
import ClientBookings from "./pages/client/ClientBookings";
import ClientServices from "./pages/client/ClientServices";
import ClientProfile from "./pages/client/ClientProfile";

/* ---------------------- ADMIN DASHBOARD ---------------------- */
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/UsersPage";
import AdminProperties from "./pages/admin/PropertiesPage";
import AdminReports from "./pages/admin/Reports";

/* ---------------------- TEMPORARY PAGES ---------------------- */
function Rentals() { return <h1>Rentals Page</h1>; }
function Apartments() { return <h1>Apartments Page</h1>; }
function Meals() { return <h1>Meals Service</h1>; }
function Translator() { return <h1>Translator Service</h1>; }
function TourGuide() { return <h1>Tour Guide Service</h1>; }
function Trainer() { return <h1>Trainer Service</h1>; }
function Massage() { return <h1>Massage Service</h1>; }

/* ============================================================
    ROLE-BASED PROTECTED ROUTE
============================================================ */
function ProtectedRoute({ allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------------- PUBLIC ROUTES ---------------------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------------------- DROPDOWN PAGES ---------------------- */}
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/massage" element={<Massage />} />

        {/* ============================================================
            HOST DASHBOARD
        ============================================================ */}
        <Route element={<ProtectedRoute allowedRoles={["host"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="units" element={<UnitsPage />} />
            <Route path="tenants" element={<TenantsPage />} />
          </Route>
        </Route>

        {/* ============================================================
            CLIENT DASHBOARD
        ============================================================ */}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboardHome />} />
            <Route path="bookings" element={<ClientBookings />} />
            <Route path="services" element={<ClientServices />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>
        </Route>

        {/* ============================================================
            ADMIN DASHBOARD
        ============================================================ */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Route>

        {/* ---------------------- 404 FALLBACK ---------------------- */}
        <Route path="*" element={<h1>404 — Not found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}
