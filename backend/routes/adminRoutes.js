// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");

// Protect all admin routes
router.use(protect);
// Add admin middleware check later: router.use(admin);

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: "host" });
    const totalClients = await User.countDocuments({ role: "client" });
    
    res.json({
      totalUsers,
      totalHosts,
      totalClients,
      totalProperties: 0,
      activeProperties: 0,
      totalBookings: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle user status
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Activity logs placeholder
router.get("/logs", async (req, res) => {
  try {
    res.json([
      { description: "System activity logs coming soon", timestamp: new Date() }
    ]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;