import api from "./api";

// Get all units across all properties
export const getAllUnits = async () => {
  const res = await api.get("/units");
  return res.data;
};

// Get units for a specific property
export const getUnitsByProperty = async (propertyId) => {
  const res = await api.get(`/units/property/${propertyId}`);
  return res.data;
};

// Get single unit by ID
export const getUnitById = async (unitId) => {
  const res = await api.get(`/units/${unitId}`);
  return res.data;
};

// Create new unit with images
export const createUnit = async (unitData) => {
  const formData = new FormData();
  
  // Append unit data
  Object.keys(unitData).forEach((key) => {
    if (key !== "images") {
      formData.append(key, unitData[key]);
    }
  });
  
  // Append images
  if (unitData.images && unitData.images.length > 0) {
    unitData.images.forEach((image) => {
      formData.append("images", image);
    });
  }
  
  const res = await api.post("/units", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Update unit with optional new images
export const updateUnit = async (unitId, unitData) => {
  const formData = new FormData();
  
  // Append unit data
  Object.keys(unitData).forEach((key) => {
    if (key !== "images") {
      formData.append(key, unitData[key]);
    }
  });
  
  // Append new images if provided
  if (unitData.images && unitData.images.length > 0) {
    unitData.images.forEach((image) => {
      formData.append("images", image);
    });
  }
  
  const res = await api.put(`/units/${unitId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete unit
export const deleteUnit = async (unitId) => {
  const res = await api.delete(`/units/${unitId}`);
  return res.data;
};

// Delete unit image
export const deleteUnitImage = async (unitId, imageUrl) => {
  const res = await api.delete(`/units/${unitId}/image`, {
    data: { imageUrl },
  });
  return res.data;
};

// Assign tenant to unit
export const assignTenantToUnit = async (unitId, tenantId) => {
  const res = await api.post(`/units/${unitId}/assign`, { tenantId });
  return res.data;
};

// Vacate unit
export const vacateUnit = async (unitId) => {
  const res = await api.patch(`/units/${unitId}/vacate`);
  return res.data;
};