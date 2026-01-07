import api from "./api"; // axios instance

export const getMyProperties = async (hostId) => {
  const res = await api.get(`/properties/host/${hostId}`);
  return res.data; //  array
};

export const createProperty = async (data) => {
  const res = await api.post("/properties", data);
  return res.data; //  created property
};

export const deleteProperty = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};
