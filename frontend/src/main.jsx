import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./tailwind.css";
import { AuthProvider } from "./context/AuthContext";
import { PropertyProvider } from "./context/PropertyContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <App />
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
