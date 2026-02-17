// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAllProperties,
  updatePropertyStatus,
  deleteProperty,
  getRevenueReport,
  getUserGrowthReport,
  getBookingStats,
  getPropertyStats,
  getActivityLogs,
} = require("../controllers/adminController");

// Protect all admin routes
router.use(protect);
// TODO: Add admin middleware check
// router.use(admin);

// ============================================
// DASHBOARD
// ============================================
router.get("/stats", getAdminStats);

// ============================================
// USER MANAGEMENT
// ============================================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", toggleUserStatus);

// ============================================
// PROPERTY MANAGEMENT
// ============================================
router.get("/properties", getAllProperties);
router.patch("/properties/:id/status", updatePropertyStatus);
router.delete("/properties/:id", deleteProperty);

// ============================================
// REPORTS
// ============================================
router.get("/reports/revenue", getRevenueReport);
router.get("/reports/user-growth", getUserGrowthReport);
router.get("/reports/bookings", getBookingStats);
router.get("/reports/properties", getPropertyStats);

// ============================================
// ACTIVITY LOGS
// ============================================
router.get("/logs", getActivityLogs);

module.exports = router;