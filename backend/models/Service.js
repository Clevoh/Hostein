const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "AC Maintenance",
        "Plumbing Service",
        "Electrical Repair",
        "Deep Cleaning",
        "Regular Cleaning",
        "Move-in/Move-out",
        "AC Repair",
        "Other",
      ],
    },
    provider: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    category: {
      type: String,
      enum: ["maintenance", "cleaning", "other"],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);