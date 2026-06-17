// backend/routes/paymentRoutes.js
// CREATE this file in backend/routes/
//
// CRITICAL NOTE about Stripe webhook:
// Stripe requires the RAW request body to verify its signature.
// express.json() parses and destroys the raw body.
// So the Stripe webhook route uses express.raw() instead.
// In server.js we register this routes file BEFORE app.use(express.json()).
// See server.js instructions at the bottom of this file.

const express = require("express");
const router  = express.Router();
const {
  initiatePayment,
  mpesaCallback,
  stripeWebhook,
  getPaymentStatus,
  getMyPayments,
  getAllPayments,
  confirmCash,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// ── PUBLIC WEBHOOK ROUTES (no auth, special body parsing) ────────────────────

// M-Pesa callback — Safaricom sends JSON, standard body parsing is fine
router.post("/mpesa/callback", mpesaCallback);

// Stripe webhook — needs RAW body for signature verification
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ── PROTECTED ROUTES (require login) ─────────────────────────────────────────
router.use(protect);

// Initiate a payment for any type (booking, service_booking, rent)
router.post("/initiate", initiatePayment);

// Poll payment status (used by frontend while waiting for M-Pesa)
router.get("/status/:paymentId", getPaymentStatus);

// Client payment history
router.get("/history", getMyPayments);

// Admin: all payments with filters
router.get("/admin", getAllPayments);

// Admin: manually confirm a cash payment
router.patch("/:paymentId/confirm-cash", confirmCash);

module.exports = router;

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO REGISTER THIS IN server.js
// ─────────────────────────────────────────────────────────────────────────────
//
// Your current server.js has app.use(express.json()) near the top.
// The Stripe webhook must be registered BEFORE express.json() processes requests.
// The route file handles this internally with express.raw() on the webhook route,
// BUT only if this routes file is registered before app.use(express.json()).
//
// Replace your server.js route section with this order:
//
//   // 1. Payment routes FIRST (Stripe webhook needs raw body)
//   app.use("/api/payments", require("./routes/paymentRoutes"));
//
//   // 2. THEN enable JSON parsing for all other routes
//   app.use(express.json());
//
//   // 3. Then all other routes
//   app.use("/api/auth",             require("./routes/authRoutes"));
//   app.use("/api/users",            require("./routes/userRoutes"));
//   app.use("/api/properties",       require("./routes/propertyRoutes"));
//   app.use("/api/bookings",         require("./routes/bookingRoutes"));
//   app.use("/api/service-provider", require("./routes/serviceProviderRoutes"));
//   app.use("/api/service-offerings",require("./routes/serviceOfferingRoutes"));
//   app.use("/api/tenants",          require("./routes/tenantRoutes"));
//   app.use("/api/units",            require("./routes/unitRoute"));
//   app.use("/api/dashboard",        require("./routes/dashboardRoutes"));
//   app.use("/api/admin",            require("./routes/adminRoutes"));