// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes safely
let authRoutes, userRoutes;
try {
  authRoutes = require("./routes/authRoutes");
  console.log(" authRoutes loaded successfully");
} catch (err) {
  console.error(" Failed to load authRoutes:", err.message);
}

try {
  userRoutes = require("./routes/userRoutes");
  console.log(" userRoutes loaded successfully");
} catch (err) {
  console.error(" Failed to load userRoutes:", err.message);
}

// Attach routes only if they are valid routers
if (typeof authRoutes === "function" || authRoutes?.stack) {
  app.use("/api/auth", authRoutes);
} else {
  console.warn(" Skipping authRoutes — invalid or not exported correctly");
}

if (typeof userRoutes === "function" || userRoutes?.stack) {
  app.use("/api/users", userRoutes);
} else {
  console.warn(" Skipping userRoutes — invalid or not exported correctly");
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
})();
