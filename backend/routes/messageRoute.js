// backend/routes/messageRoute.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const ServiceBooking = require("../models/ServiceBooking");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chat/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "chat-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images and documents are allowed"));
  },
});

// All routes require authentication
router.use(protect);

// ─── HELPER: safe string ID comparison ───────────────────────────────────────
function sameId(a, b) {
  if (!a || !b) return false;
  return (a._id || a).toString() === (b._id || b).toString();
}

// ─── HELPER: send socket notification ────────────────────────────────────────
function sendNotification(io, userSockets, receiverId, notification) {
  const receiverSocketId = userSockets.get(receiverId.toString());
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", notification);
    console.log(`📢 Notification sent to user ${receiverId}`);
  } else {
    console.log(`⚠️ User ${receiverId} not connected, notification queued`);
  }
}

// ─── HELPER: fetch booking (service or property) with full population ─────────
async function findBooking(bookingId) {
  // Try service booking first
  let booking = await ServiceBooking.findById(bookingId)
    .populate("serviceOffering", "name")
    .populate("client", "_id name")
    .populate("provider", "_id name");

  if (booking) {
    return { booking, isServiceBooking: true };
  }

  // Try property booking with deep host population
  booking = await Booking.findById(bookingId)
    .populate("client", "_id name email")
    .populate({
      path: "property",
      select: "title host",
      populate: { path: "host", select: "_id name email" },
    });

  return { booking, isServiceBooking: false };
}

// ─── HELPER: authorization check ─────────────────────────────────────────────
function isAuthorized(booking, isServiceBooking, userId) {
  if (isServiceBooking) {
    return (
      sameId(booking.client, userId) ||
      sameId(booking.provider, userId)
    );
  }

  const clientId = booking.client?._id || booking.client;
  const hostId   = booking.property?.host?._id || booking.property?.host;

  console.log("🔐 Auth check:", {
    userId:   userId.toString(),
    clientId: clientId?.toString(),
    hostId:   hostId?.toString(),
  });

  return sameId(clientId, userId) || sameId(hostId, userId);
}

// ─── GET all messages for a booking ──────────────────────────────────────────
router.get("/booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { booking, isServiceBooking } = await findBooking(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!isAuthorized(booking, isServiceBooking, req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view these messages" });
    }

    const messages = await Message.find({ booking: bookingId })
      .populate("sender",   "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─── POST send text message ───────────────────────────────────────────────────
router.post("/send", async (req, res) => {
  try {
    const { bookingId, receiverId, content } = req.body;

    console.log("📤 Sending message:", {
      bookingId,
      receiverId,
      content: content?.substring(0, 50),
    });

    if (!bookingId || !receiverId || !content) {
      return res.status(400).json({
        message: "Missing required fields: bookingId, receiverId, content",
      });
    }

    const { booking, isServiceBooking } = await findBooking(bookingId);

    if (!booking) {
      console.error("❌ Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!isAuthorized(booking, isServiceBooking, req.user._id)) {
      console.error("❌ Not authorized:", { userId: req.user._id, bookingId });
      return res.status(403).json({
        message: "Not authorized to send messages in this booking",
      });
    }

    const message = await Message.create({
      booking:     bookingId,
      sender:      req.user._id,
      receiver:    receiverId,
      messageType: "text",
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender",   "name email")
      .populate("receiver", "name email");

    // Real-time delivery
    req.app.get("io").to(bookingId).emit("new_message", populatedMessage);

    // Notification
    const io          = req.app.get("io");
    const userSockets = req.app.get("userSockets");

    sendNotification(io, userSockets, receiverId, {
      title:     `New message from ${req.user.name}`,
      message:   content.length > 50 ? content.substring(0, 50) + "..." : content,
      type:      "message",
      bookingId: bookingId,
    });

    console.log("✅ Message sent successfully:", message._id);
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─── POST send file / image ───────────────────────────────────────────────────
router.post("/send-file", upload.single("file"), async (req, res) => {
  try {
    const { bookingId, receiverId, messageType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { booking, isServiceBooking } = await findBooking(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!isAuthorized(booking, isServiceBooking, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      booking:     bookingId,
      sender:      req.user._id,
      receiver:    receiverId,
      messageType: messageType || "file",
      fileUrl:     `/uploads/chat/${req.file.filename}`,
      fileName:    req.file.originalname,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender",   "name email")
      .populate("receiver", "name email");

    req.app.get("io").to(bookingId).emit("new_message", populatedMessage);

    const io            = req.app.get("io");
    const userSockets   = req.app.get("userSockets");
    const fileTypeLabel = messageType === "image" ? "an image" : "a file";

    sendNotification(io, userSockets, receiverId, {
      title:     `${req.user.name} sent ${fileTypeLabel}`,
      message:   req.file.originalname,
      type:      "message",
      bookingId: bookingId,
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send file error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─── POST send location ───────────────────────────────────────────────────────
router.post("/send-location", async (req, res) => {
  try {
    const { bookingId, receiverId, latitude, longitude, address } = req.body;

    const { booking, isServiceBooking } = await findBooking(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!isAuthorized(booking, isServiceBooking, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      booking:     bookingId,
      sender:      req.user._id,
      receiver:    receiverId,
      messageType: "location",
      location:    { latitude, longitude, address },
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender",   "name email")
      .populate("receiver", "name email");

    req.app.get("io").to(bookingId).emit("new_message", populatedMessage);

    const io          = req.app.get("io");
    const userSockets = req.app.get("userSockets");

    sendNotification(io, userSockets, receiverId, {
      title:     `${req.user.name} shared their location`,
      message:   address || "Location shared",
      type:      "message",
      bookingId: bookingId,
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send location error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE a message ─────────────────────────────────────────────────────────
// Only the original sender can delete their own message.
// Broadcasts "message_deleted" to the booking room so both sides update live.
router.delete("/:messageId", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only the sender may delete
    if (!sameId(message.sender, req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    const bookingId = message.booking.toString();
    await message.deleteOne();

    // Broadcast to everyone in the room so the other user's UI updates instantly
    req.app.get("io").to(bookingId).emit("message_deleted", {
      messageId: req.params.messageId,
      bookingId,
    });

    console.log("🗑️ Message deleted:", req.params.messageId);
    res.json({ message: "Message deleted", messageId: req.params.messageId });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─── PATCH mark message as read ──────────────────────────────────────────────
router.patch("/read/:messageId", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!sameId(message.receiver, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET unread count for a booking ──────────────────────────────────────────
router.get("/unread/:bookingId", async (req, res) => {
  try {
    const count = await Message.countDocuments({
      booking:  req.params.bookingId,
      receiver: req.user._id,
      isRead:   false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;