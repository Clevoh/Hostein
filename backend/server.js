//   app.use("/api/payments", ...) is registered BEFORE app.use(express.json())
//   This is required for Stripe webhook signature verification.
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");
const dns      = require("dns");
const http     = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app    = express();
const server = http.createServer(app);

// ── SOCKET.IO SETUP ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ── userSockets: userId (string) → Set<socketId> ─────────────────────────────
// Stored as a Set so one user logged in on multiple tabs still gets all
// notifications. bookingController + messageRoute both read this via
// req.app.get("userSockets").
const userSockets = new Map();

// Make io + userSockets accessible in every route/controller
// IMPORTANT: set these BEFORE registering routes so they're available
// on req.app from the very first request.
app.set("io",          io);
app.set("userSockets", userSockets);

dns.setDefaultResultOrder("ipv4first");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── STATIC FILES ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure upload directories exist
["uploads/properties", "uploads/services", "uploads/chat"].forEach((dir) => {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    console.log(`✅ Created ${dir}`);
  }
});

// ── PAYMENT ROUTES FIRST (raw body needed for Stripe webhook) ────────────────
app.use("/api/payments", require("./routes/paymentRoutes"));

// ── JSON BODY PARSER (all other routes) ──────────────────────────────────────
app.use(express.json());

// ── ALL OTHER ROUTES ──────────────────────────────────────────────────────────
app.use("/api/auth",               require("./routes/authRoutes"));
app.use("/api/users",              require("./routes/userRoutes"));
app.use("/api/properties",         require("./routes/propertyRoutes"));
app.use("/api/bookings",           require("./routes/bookingRoutes"));
app.use("/api/service-provider",   require("./routes/serviceProviderRoutes"));
app.use("/api/service-offerings",  require("./routes/serviceOfferingRoutes"));
app.use("/api/services",           require("./routes/serviceRoutes"));
app.use("/api/messages",           require("./routes/messageRoute"));
app.use("/api/tenants",            require("./routes/tenantRoutes"));
app.use("/api/tenant-assignments", require("./routes/tenantAssignmentRoutes"));
app.use("/api/units",              require("./routes/unitRoute"));
app.use("/api/dashboard",          require("./routes/dashboardRoutes"));
app.use("/api/admin",              require("./routes/adminRoutes"));
app.use("/api/reviews",            require("./routes/reviewRoutes"));

// ── SOCKET.IO CONNECTION HANDLING ────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("👤 Socket connected:", socket.id);

  // ── Register user ──────────────────────────────────────────────────────────
  // One user can have multiple sockets (multiple tabs). We store all of them
  // in a Set so every tab receives the notification.
  socket.on("register_user", (userId) => {
    if (!userId) {
      console.warn("⚠️ register_user called without userId");
      return;
    }

    const uid = userId.toString();

    if (!userSockets.has(uid)) {
      userSockets.set(uid, new Set());
    }
    userSockets.get(uid).add(socket.id);

    // Back-reference used during disconnect cleanup
    socket.userId = uid;

    socket.emit("registration_confirmed", { userId: uid, socketId: socket.id });

    console.log(`✅ User ${uid} registered → socket ${socket.id}`);
    console.log(`📊 Total registered users: ${userSockets.size}`);
  });

  // ── Chat rooms ─────────────────────────────────────────────────────────────
  socket.on("join_booking", (bookingId) => {
    if (!bookingId) return;
    socket.join(bookingId);
    console.log(`✅ Socket ${socket.id} joined room: ${bookingId}`);
  });

  socket.on("leave_booking", (bookingId) => {
    if (!bookingId) return;
    socket.leave(bookingId);
    console.log(`👋 Socket ${socket.id} left room: ${bookingId}`);
  });

  // ── Typing indicators ──────────────────────────────────────────────────────
  socket.on("typing", ({ bookingId, userName }) => {
    if (!bookingId) return;
    socket.to(bookingId).emit("user_typing", { userName });
  });

  socket.on("stop_typing", ({ bookingId }) => {
    if (!bookingId) return;
    socket.to(bookingId).emit("user_stop_typing");
  });

  // ── Message deleted (re-broadcast to the other side of the chat) ───────────
  socket.on("message_deleted", ({ bookingId, messageId }) => {
    if (!bookingId || !messageId) return;
    socket.to(bookingId).emit("message_deleted", { messageId, bookingId });
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const uid = socket.userId;
    if (uid && userSockets.has(uid)) {
      userSockets.get(uid).delete(socket.id);
      if (userSockets.get(uid).size === 0) {
        userSockets.delete(uid);
      }
      console.log(`❌ User ${uid} socket ${socket.id} disconnected. Remaining sockets: ${userSockets.get(uid)?.size ?? 0}`);
    } else {
      console.log(`❌ Unregistered socket disconnected: ${socket.id}`);
    }
    console.log(`📊 Total registered users: ${userSockets.size}`);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// ── ERROR HANDLING ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── START SERVER ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family:                   4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🚀 HOSTEIN SERVER RUNNING`);
      console.log(`${"=".repeat(60)}`);
      console.log(`📡 Port:        ${PORT}`);
      console.log(`💬 Socket.io:   Ready`);
      console.log(`🔔 Notifications: Enabled (Set-based multi-tab)`);
      console.log(`💬 Chat:          Enabled`);
      console.log(`${"=".repeat(60)}\n`);
    });
  } catch (err) {
    console.error("❌ MongoDB failed:", err.message);
    process.exit(1);
  }
})();