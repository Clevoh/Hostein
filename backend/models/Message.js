// backend/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Link to service booking
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBooking",
      required: true,
    },

    // Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Message type
    messageType: {
      type: String,
      enum: ["text", "image", "file", "location"],
      default: "text",
    },

    // Text content
    content: {
      type: String,
      required: function() {
        return this.messageType === "text";
      },
    },

    // File/image URL
    fileUrl: {
      type: String,
    },

    fileName: {
      type: String,
    },

    // Location data
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
messageSchema.index({ booking: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", messageSchema);