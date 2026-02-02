import api from "./api"; // axios instance

export const getMyProperties = async () => {
  const res = await api.get("/properties/mine");
  return res.data;
};

export const createProperty = async (formData) => {
  // 🆕 UPDATED: Handle FormData for file uploads
  const res = await api.post("/properties", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProperty = async (id, formData) => {
  // 🆕 UPDATED: Handle FormData for file uploads
  const res = await api.put(`/properties/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};

// 🆕 NEW: Delete specific image from property
export const deletePropertyImage = async (propertyId, imageUrl) => {
  const res = await api.delete(`/properties/${propertyId}/images/${encodeURIComponent(imageUrl)}`);
  return res.data;
};