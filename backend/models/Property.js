const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },

    // NEW — defines how units behave
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

    pricePerNight: { type: Number }, // used for short stays
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    images: [String],
    amenities: [String],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
