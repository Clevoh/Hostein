import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import MainLayout from "./Layouts/MainLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

// Temporary pages for dropdown links
function Rentals() { return <h1>Rentals Page</h1>; }
function Apartments() { return <h1>Apartments Page</h1>; }
function Meals() { return <h1>Meals Service</h1>; }
function Translator() { return <h1>Translator Service</h1>; }
function TourGuide() { return <h1>Tour Guide Service</h1>; }
function Trainer() { return <h1>Trainer Service</h1>; }
function Massage() { return <h1>Massage Service</h1>; }

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dropdown Linked Routes */}
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/massage" element={<Massage />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
