// src/routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";

import DashboardHome from "./pages/dashboard/DashboardHome";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
