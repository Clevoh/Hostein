import { createContext, useContext, useState, useEffect } from "react";
import { getMyProperties, deleteProperty as deletePropertyAPI } from "../services/propertyService";

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties when component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
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

  // Add a new property to the list
  const addProperty = (newProperty) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  // Update an existing property in the list
  const updatePropertyInContext = (updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((prop) =>
        prop._id === updatedProperty._id ? updatedProperty : prop
      )
    );
  };

  // Delete a property
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
    refreshProperties: fetchProperties, // Add this for manual refresh
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
