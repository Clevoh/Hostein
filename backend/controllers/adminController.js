// backend/controllers/adminController.js
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");

// ============================================
// DASHBOARD STATISTICS
// ============================================
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: "host" });
    const totalClients = await User.countDocuments({ role: "client" });
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: "active" });
    const totalBookings = await Booking.countDocuments();

    // Calculate monthly revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.find({
      createdAt: { $gte: currentMonth },
      status: "completed",
    });
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    res.json({
      totalUsers,
      totalHosts,
      totalClients,
      totalProperties,
      activeProperties,
      totalBookings,
      monthlyRevenue,
      revenueGrowth: 12, // TODO: Calculate actual growth
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.isActive = status === "active";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================================
// PROPERTY MANAGEMENT
// ============================================
exports.getAllProperties = async (req, res) => {
  try {
    const { status, search, hostId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (hostId) query.owner = hostId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================================
// REPORTS
// ============================================
exports.getRevenueReport = async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const thisMonthBookings = await Booking.find({
      createdAt: { $gte: currentMonth },
      status: "completed",
    });

    const lastMonthBookings = await Booking.find({
      createdAt: { $gte: lastMonth, $lt: currentMonth },
      status: "completed",
    });

    const allBookings = await Booking.find({ status: "completed" });

    const thisMonth = thisMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const lastMonthTotal = lastMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const total = allBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const growth = lastMonthTotal > 0 
      ? Math.round(((thisMonth - lastMonthTotal) / lastMonthTotal) * 100) 
      : 0;

    res.json({
      total,
      thisMonth,
      lastMonth: lastMonthTotal,
      growth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserGrowthReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: { $ne: false } });

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    res.json({
      total: totalUsers,
      activeUsers,
      newThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBookingStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const completed = await Booking.countDocuments({ status: "completed" });
    const completedRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const thisMonth = await Booking.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    res.json({
      total,
      thisMonth,
      completedRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPropertyStats = async (req, res) => {
  try {
    const total = await Property.countDocuments();
    const active = await Property.countDocuments({ status: "active" });
    const occupancyRate = total > 0 ? Math.round((active / total) * 100) : 0;

    res.json({
      total,
      active,
      occupancyRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================================
// ACTIVITY LOGS
// ============================================
exports.getActivityLogs = async (req, res) => {
  try {
    // TODO: Implement actual activity logging system
    const activities = [
      {
        description: "System initialized",
        timestamp: new Date(),
      },
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};