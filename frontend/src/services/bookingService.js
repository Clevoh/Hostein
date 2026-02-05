import api from "./api";

// Get client's bookings
export const getMyBookings = async () => {
  const res = await api.get("/bookings/my-bookings");
  return res.data;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  const res = await api.get(`/bookings/${bookingId}`);
  return res.data;
};

// Create new booking
export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

// Update booking
export const updateBooking = async (bookingId, bookingData) => {
  const res = await api.put(`/bookings/${bookingId}`, bookingData);
  return res.data;
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  const res = await api.patch(`/bookings/${bookingId}/cancel`);
  return res.data;
};

// Get booking statistics
export const getBookingStats = async () => {
  const res = await api.get("/bookings/stats");
  return res.data;
};