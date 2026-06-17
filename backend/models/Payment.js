// backend/models/Payment.js
// REPLACES the existing Payment.js
//
// Supports:
//   - Property bookings  (type: "booking",         ref: Booking)
//   - Service bookings   (type: "service_booking",  ref: ServiceBooking)
//   - Rent payments      (type: "rent",             ref: Tenant / Unit)
//
// Gateways supported: mpesa, stripe, cash

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // ── WHO PAID ───────────────────────────────────────────────────
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── WHAT IS BEING PAID FOR ─────────────────────────────────────
    // paymentType tells us which ref field to look at
    paymentType: {
      type: String,
      enum: ["booking", "service_booking", "rent"],
      required: true,
    },

    // Property/hostel booking
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    // Service booking (cleaning, electrical, etc.)
    serviceBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBooking",
      default: null,
    },

    // Rent payment (links to a unit + tenant)
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
    rentMonth: {
      type: String, // e.g. "2025-06" — the month this rent covers
      default: null,
    },

    // ── AMOUNT ─────────────────────────────────────────────────────
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "KES",
      uppercase: true,
    },

    // ── PAYMENT METHOD & STATUS ────────────────────────────────────
    method: {
      type: String,
      enum: ["mpesa", "stripe", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },

    // ── M-PESA FIELDS ──────────────────────────────────────────────
    // Populated when method === "mpesa"
    mpesa: {
      phone:             { type: String, default: null },
      checkoutRequestId: { type: String, default: null }, // from STK push response
      merchantRequestId: { type: String, default: null },
      receiptNumber:     { type: String, default: null }, // from callback on success
      resultCode:        { type: Number, default: null },
      resultDesc:        { type: String, default: null },
    },

    // ── STRIPE FIELDS ──────────────────────────────────────────────
    // Populated when method === "stripe"
    stripe: {
      paymentIntentId: { type: String, default: null },
      clientSecret:    { type: String, default: null }, // sent to frontend
      chargeId:        { type: String, default: null }, // from webhook on success
    },

    // ── NOTES ──────────────────────────────────────────────────────
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ── INDEXES ────────────────────────────────────────────────────────────────
// Fast lookups used in webhook handlers
paymentSchema.index({ "mpesa.checkoutRequestId": 1 }, { sparse: true });
paymentSchema.index({ "stripe.paymentIntentId": 1 },  { sparse: true });
paymentSchema.index({ paidBy: 1, status: 1 });
paymentSchema.index({ booking: 1 },        { sparse: true });
paymentSchema.index({ serviceBooking: 1 }, { sparse: true });

module.exports = mongoose.model("Payment", paymentSchema);