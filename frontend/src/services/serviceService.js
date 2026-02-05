import api from "./api";

// Get client's service bookings
export const getMyServices = async () => {
  const res = await api.get("/services/my-services");
  return res.data;
};

// Get available services
export const getAvailableServices = async () => {
  const res = await api.get("/services/available");
  return res.data;
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  const res = await api.get(`/services/${serviceId}`);
  return res.data;
};

// Book a service
export const bookService = async (serviceData) => {
  const res = await api.post("/services/book", serviceData);
  return res.data;
};

// Update service booking
export const updateServiceBooking = async (serviceId, serviceData) => {
  const res = await api.put(`/services/${serviceId}`, serviceData);
  return res.data;
};

// Cancel service booking
export const cancelServiceBooking = async (serviceId) => {
  const res = await api.patch(`/services/${serviceId}/cancel`);
  return res.data;
};

// Reschedule service
export const rescheduleService = async (serviceId, newDate, newTime) => {
  const res = await api.patch(`/services/${serviceId}/reschedule`, {
    scheduledDate: newDate,
    scheduledTime: newTime,
  });
  return res.data;
};