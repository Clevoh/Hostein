// frontend/src/context/PropertyContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getMyProperties, deleteProperty as deletePropertyAPI } from "../services/propertyService";

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ false by default — don't load until authenticated

  const fetchProperties = async () => {
    // ✅ Guard: only fetch if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only fetch on mount if token already exists (returning user)
  // ✅ Listen for login/logout events to fetch or clear properties
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProperties();

    const handleLogin = () => fetchProperties();
    const handleLogout = () => setProperties([]);

    window.addEventListener("auth:login", handleLogin);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:login", handleLogin);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const addProperty = (newProperty) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  const updatePropertyInContext = (updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((prop) =>
        prop._id === updatedProperty._id ? updatedProperty : prop
      )
    );
  };

  const deleteProperty = async (propertyId) => {
    try {
      await deletePropertyAPI(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (error) {
      console.error("Failed to delete property:", error);
      throw error;
    }
  };

  const value = {
    properties,
    loading,
    addProperty,
    updatePropertyInContext,
    deleteProperty,
    refreshProperties: fetchProperties,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
}