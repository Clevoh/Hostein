// backend/routes/bookingRoutes.js
// Thin router — all logic lives in bookingController.js
// KEY FIX: removed the inline route handlers that were overriding the controller
//          and caused "propertyId, checkIn and checkOut are required" errors.

const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Create booking ───────────────────────────────────────────────────────────
router.post("/", protect, ctrl.createBooking);

// ── Client: own bookings ─────────────────────────────────────────────────────
router.get("/my-bookings", protect, ctrl.getMyBookings);

// ── Host: bookings for their properties ──────────────────────────────────────
router.get("/host-bookings", protect, ctrl.getHostBookings);

// ── Admin: all bookings ───────────────────────────────────────────────────────
router.get("/", protect, authorize("admin", "landlord"), ctrl.getAllBookings);

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/stats", protect, ctrl.getBookingStats);

// ── Single booking ────────────────────────────────────────────────────────────
router.get("/:id", protect, ctrl.getBookingById);

// ── Update (dates / status / payment / notes) ─────────────────────────────────
router.put("/:id", protect, ctrl.updateBooking);

// ── Lifecycle actions ─────────────────────────────────────────────────────────
router.patch("/:id/confirm",  protect, ctrl.confirmBooking);
router.patch("/:id/cancel",   protect, ctrl.cancelBooking);
router.patch("/:id/complete", protect, ctrl.completeBooking);
router.patch("/:id/payment",  protect, ctrl.updatePaymentStatus);
router.patch("/:id/extend",   protect, ctrl.extendBooking);

// ── Delete ────────────────────────────────────────────────────────────────────
router.delete("/:id", protect, ctrl.deleteBooking);

module.exports = router;