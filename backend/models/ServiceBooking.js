// backend/models/ServiceBooking.js
// REPLACES the existing ServiceBooking.js
//
// Key fixes vs original:
//   - "service" field was wrongly using booking-status enums — fixed to store service name/type
//   - Added "paymentStatus" to match Booking.js pattern
//   - Added "serviceOffering" ref so we can link back to the ServiceOffering document
//   - Expanded "category" enum to match the full list used in ServiceOffering

const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema(
  {
    // ── PARTIES ───────────────────────────────────────────────────
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── WHAT SERVICE ──────────────────────────────────────────────
    serviceOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceOffering",
      required: true,
    },
    serviceType: {
      type: String,   // human-readable name e.g. "Deep Cleaning"
      required: true,
    },
    category: {
      type: String,
      enum: ["cleaning", "electrical", "plumbing", "carpentry",
             "painting", "gardening", "security", "maintenance", "other"],
      required: true,
    },
    description: {
      type: String,
    },

    // ── WHERE (optional — if tied to a property/unit) ─────────────
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },

    // ── WHEN ──────────────────────────────────────────────────────
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,  // e.g. "2 hours"
    },

    // ── PRICE ─────────────────────────────────────────────────────
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "KES",
    },

    // ── BOOKING STATUS ────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    // ── PAYMENT STATUS ────────────────────────────────────────────
    // Mirrors Booking.js pattern; actual payment detail is in Payment collection
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid"],
      default: "unpaid",
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);