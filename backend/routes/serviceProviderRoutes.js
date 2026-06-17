const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const ServiceOffering = require("../models/ServiceOffering");
const ServiceBooking = require("../models/ServiceBooking");

// All routes require service_provider role
router.use(protect);
router.use(authorize("service_provider"));

// Dashboard stats
router.get("/dashboard", async (req, res) => {
  const providerId = req.user._id;

  const totalServices = await ServiceOffering.countDocuments({ provider: providerId });
  
  //  Fixed: Use ServiceBooking instead of old Service model
  const pendingBookings = await ServiceBooking.countDocuments({
    provider: providerId,
    status: "pending",
  });
  
  const completedJobs = await ServiceBooking.countDocuments({
    provider: providerId,
    status: "completed",
  });

  const completedBookings = await ServiceBooking.find({
    provider: providerId,
    status: "completed",
  });
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  res.json({
    totalServices,
    pendingBookings,
    completedJobs,
    totalEarnings,
  });
});

// Use existing ServiceOfferingController methods
router.get("/services", require("../controllers/ServiceOfferingController").getMyOfferings);
router.post("/services", require("../controllers/ServiceOfferingController").createOffering);
router.put("/services/:id", require("../controllers/ServiceOfferingController").updateOffering);
router.delete("/services/:id", require("../controllers/ServiceOfferingController").deleteOffering);

//  BOOKINGS - Updated to use ServiceBooking model
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({ provider: req.user._id })
      .populate("client", "name email")
      .populate("serviceOffering")  //  Populate the service offering details
      .sort({ scheduledDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await ServiceBooking.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      { status },
      { new: true }
    ).populate("client", "name email")
     .populate("serviceOffering");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;