const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dns = require("dns");
require("dotenv").config();

const app = express();

// CRITICAL: Fix DNS resolution issue - Force IPv4
dns.setDefaultResultOrder('ipv4first');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads", "properties");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads/properties directory");
}

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const unitRoute = require("./routes/unitRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceOfferingRoutes = require("./routes/serviceOfferingRoutes");
const serviceProviderRoutes = require("./routes/serviceProviderRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/service-provider", serviceProviderRoutes); //  fixed: was /api/service-providers
app.use("/api/service-offerings", serviceOfferingRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/units", unitRoute);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
(async () => {
  try {
    console.log("🔍 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database:", mongoose.connection.name);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("\n🔧 This is a network/firewall issue. Try:");
    console.error("   1. Connect via mobile hotspot");
    console.error("   2. Use a VPN");
    console.error("   3. Contact your network administrator\n");
    
    // Start server anyway (API will work, but no database)
    app.listen(PORT, () => {
      console.log(`⚠️  Server running on port ${PORT} WITHOUT database`);
    });
  }
})();