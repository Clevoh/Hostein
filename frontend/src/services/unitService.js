import api from "./api";

export const getUnitsByProperty = async (propertyId) => {
  const res = await api.get(`/units/property/${propertyId}`);
  return res.data; //  array of units
};

export const createUnit = async (data) => {
  const res = await api.post("/units", data);
  return res.data;
};

export const deleteUnit = async (id) => {
  const res = await api.delete(`/units/${id}`);
  return res.data;
};
