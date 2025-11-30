import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import DashboardHome from "./pages/dashboard/DashboardHome";

import TenantsPage from "./pages/tenants/TenantsPage";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Sidebar />
      <Header />

      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/units" element={<UnitsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
