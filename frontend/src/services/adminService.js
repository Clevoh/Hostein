import api from "./api";

// ============================================
// DASHBOARD / STATISTICS
// ============================================

// Get admin dashboard statistics
export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

// Get system analytics
export const getSystemAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with filters
export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.role) params.append("role", filters.role);
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  
  const res = await api.get(`/admin/users?${params.toString()}`);
  return res.data;
};

// Get single user details
export const getUserById = async (userId) => {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
};

// Update user (role, status, etc.)
export const updateUser = async (userId, updateData) => {
  const res = await api.put(`/admin/users/${userId}`, updateData);
  return res.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};

// Suspend/Activate user
export const toggleUserStatus = async (userId, isActive) => {
  const res = await api.patch(`/admin/users/${userId}/status`, { isActive });
  return res.data;
};

// ============================================
// PROPERTY MANAGEMENT
// ============================================

// Get all properties (admin view - includes all hosts)
export const getAllProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.search) params.append("search", filters.search);
  if (filters.hostId) params.append("hostId", filters.hostId);
  
  const res = await api.get(`/admin/properties?${params.toString()}`);
  return res.data;
};

// Approve/Reject property
export const updatePropertyStatus = async (propertyId, status) => {
  const res = await api.patch(`/admin/properties/${propertyId}/status`, { status });
  return res.data;
};

// Delete property
export const deleteProperty = async (propertyId) => {
  const res = await api.delete(`/admin/properties/${propertyId}`);
  return res.data;
};

// ============================================
// BOOKINGS MANAGEMENT
// ============================================

// Get all bookings across the platform
export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  
  const res = await api.get(`/admin/bookings?${params.toString()}`);
  return res.data;
};

// ============================================
// REPORTS & ANALYTICS
// ============================================

// Get revenue report
export const getRevenueReport = async (startDate, endDate) => {
  const res = await api.get("/admin/reports/revenue", {
    params: { startDate, endDate }
  });
  return res.data;
};

// Get user growth report
export const getUserGrowthReport = async (period = "month") => {
  const res = await api.get("/admin/reports/user-growth", {
    params: { period }
  });
  return res.data;
};

// Get booking statistics
export const getBookingStats = async (period = "month") => {
  const res = await api.get("/admin/reports/bookings", {
    params: { period }
  });
  return res.data;
};

// Get property statistics
export const getPropertyStats = async () => {
  const res = await api.get("/admin/reports/properties");
  return res.data;
};

// ============================================
// ACTIVITY LOGS
// ============================================

// Get system activity logs
export const getActivityLogs = async (limit = 50) => {
  const res = await api.get("/admin/logs", { params: { limit } });
  return res.data;
};

// ============================================
// SYSTEM SETTINGS
// ============================================

// Get platform settings
export const getSystemSettings = async () => {
  const res = await api.get("/admin/settings");
  return res.data;
};

// Update platform settings
export const updateSystemSettings = async (settings) => {
  const res = await api.put("/admin/settings", settings);
  return res.data;
};