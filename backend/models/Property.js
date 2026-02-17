const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },

    category: {
      type: String,
      enum: ["apartment", "hostel", "short_stay"],
      required: true,
    },

    rentType: {
      type: String,
      enum: ["monthly", "daily"],
      required: true,
    },

    pricePerNight: { type: Number },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    images: [String],
    amenities: [String],
    isAvailable: { type: Boolean, default: true },

    //  HOSTEL FIELDS
    hostelType: {
      type: String,
      enum: ["accommodation_only", "meals_included", "mixed"],
      default: "accommodation_only",
    },

    mealPlans: [
      {
        name: {
          type: String,
          enum: ["breakfast", "lunch", "dinner", "half_board", "full_board"],
        },
        priceDaily: { type: Number, default: 0 },
        priceMonthly: { type: Number, default: 0 },
        description: { type: String },
        isIncluded: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);