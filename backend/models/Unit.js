// backend/models/Unit.js
const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: [true, "Unit number is required"],
      trim: true,
    },

    unitType: {
      type: String,
      required: [true, "Unit type is required"],
      enum: [
        "Single Room",
        "Bedsitter",
        "Studio",
        "1 Bedroom",
        "2 Bedroom",
        "3 Bedroom",
      ],
    },

    bedrooms: {
      type: Number,
      required: [true, "Bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },

    bathrooms: {
      type: Number,
      required: [true, "Bathrooms is required"],
      min: [1, "Bathrooms must be at least 1"],
    },

    rentAmount: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent cannot be negative"],
    },

    // HOSTEL MEAL PLAN FIELDS
    mealPlanType: {
      type: String,
      enum: ["none", "breakfast", "lunch", "dinner", "half_board", "full_board"],
      default: "none",
    },

    mealPlanCost: {
      type: Number,
      default: 0,
    },

    totalMonthlyCost: {
      type: Number,
      default: 0,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
      index: true,
    },

    isOccupied: {
      type: Boolean,
      default: false,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },

    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// 🆕 Auto-calculate total monthly cost before saving
unitSchema.pre("save", function (next) {
  this.totalMonthlyCost = (this.rentAmount || 0) + (this.mealPlanCost || 0);
  next();
});

// 🔒 Prevent duplicate unit numbers per property
unitSchema.index({ property: 1, unitNumber: 1 }, { unique: true });

module.exports = mongoose.model("Unit", unitSchema);