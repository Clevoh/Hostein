const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // What is being reviewed
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    serviceOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceOffering",
    },
    serviceBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBooking",
    },
    
    // Who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Review content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    
    // Host/Provider reply
    reply: {
      type: String,
      trim: true,
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    // Status
    status: {
      type: String,
      enum: ["active", "hidden", "flagged"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
reviewSchema.index({ property: 1, createdAt: -1 });
reviewSchema.index({ serviceOffering: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model("Review", reviewSchema);