const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Client routes
router.get("/my-bookings", bookingController.getMyBookings);
router.get("/stats", bookingController.getBookingStats);

// General routes
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.patch("/:id/cancel", bookingController.cancelBooking);

// Admin/Host routes
router.get("/", bookingController.getAllBookings);
router.patch("/:id/confirm", bookingController.confirmBooking);

module.exports = router;