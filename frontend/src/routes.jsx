import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DashboardHome from "./pages/dashboard/DashboardHome";

import TenantsPage from "./pages/tenants/TenantsPage";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";


const AppRoutes = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="*" element={<DashboardHome />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
