import { createContext, useContext, useState } from "react";

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);

  /* PROPERTY CRUD */
  const addProperty = (property) => {
    setProperties((prev) => [...prev, property]);
  };

  const updateProperty = (id, data) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  /* UNIT CRUD (NESTED UNDER PROPERTY) */
  const addUnit = (propertyId, unit) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, units: [...p.units, unit] }
          : p
      )
    );
  };

  const updateUnit = (propertyId, unitId, data) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              units: p.units.map((u) =>
                u.id === unitId ? { ...u, ...data } : u
              ),
            }
          : p
      )
    );
  };

  const deleteUnit = (propertyId, unitId) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              units: p.units.filter((u) => u.id !== unitId),
            }
          : p
      )
    );
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        addUnit,
        updateUnit,
        deleteUnit,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);
