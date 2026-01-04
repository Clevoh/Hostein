import api from "./api";

export const getUnitsByProperty = async (propertyId) => {
  const res = await api.get(`/units/property/${propertyId}`);
  return res.data;
};

export const createUnit = async (data) => {
  const res = await api.post("/units", data);
  return res.data;
};
