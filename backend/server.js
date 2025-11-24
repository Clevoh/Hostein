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

//  Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const unitRoute = require("./routes/unitRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");

//  Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/units", unitRoute);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

//  Connect to MongoDB and start the server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
  }
})();
