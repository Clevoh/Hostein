// src/routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboard layout
import DashboardLayout from "./layouts/dashboard/DashboardLayout";

// **NEW** Overview Page (Host Dashboard Home)
import Overview from "./pages/dashboard/Overview";

import PropertiesPage from "./pages/properties/PropertiesPage";
import UnitsPage from "./pages/units/UnitsPage";
import TenantsPage from "./pages/tenants/TenantsPage";

/* Temporary pages for dropdown links */
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

        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dropdown pages */}
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/massage" element={<Massage />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} /> 
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 — Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
