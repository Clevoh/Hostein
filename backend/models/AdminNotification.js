// models/AdminNotification.js
const adminNotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Then in routes:
await AdminNotification.create({
  title: "New User",
  message: "User signed up",
  type: "info"
});

// Broadcast to all connected admins
io.emit("admin_notification", notification);