import { createContext, useContext, useEffect, useState } from "react";
import {
  getMyProperties,
  createProperty,
  deleteProperty as apiDeleteProperty,
} from "../services/propertyService";
import { useAuth } from "./AuthContext"; // 👈 IMPORTANT

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const { user } = useAuth(); // logged-in user
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROPERTIES ON LOAD
useEffect(() => {
  if (!user?._id) {
    setProperties([]);
    setLoading(false);
    return;
  }

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await getMyProperties(user._id);

      // 🔒 ALWAYS FORCE ARRAY
      const safeProperties = Array.isArray(res) ? res : [];

      setProperties(safeProperties);
    } catch (error) {
      console.error("LOAD PROPERTIES FAILED", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, [user?._id]);


  // ✅ ADD PROPERTY (local state)
  const addProperty = (property) => {
    setProperties((prev) => [property, ...prev]);
  };

  // ✅ DELETE PROPERTY
  const deleteProperty = async (id) => {
    await apiDeleteProperty(id);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        addProperty,
        deleteProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);
