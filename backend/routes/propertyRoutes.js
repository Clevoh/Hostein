const express = require("express");
const router = express.Router();

// Middleware
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Controllers
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesByHost,
  getMyProperties,
  deletePropertyImage,
} = require("../controllers/propertyController");

// ==============================
// PROPERTY ROUTES
// ==============================

// 🔐 AUTHENTICATED ROUTES (require login)
// IMPORTANT: Place specific routes BEFORE parameterized routes like "/:id"

// Get properties owned by logged-in host/landlord
router.get("/mine", protect, getMyProperties);

// Get properties by specific host ID
router.get("/host/:hostId", protect, getPropertiesByHost);

// ==============================
// 🌍 PUBLIC ROUTES (no authentication)
// ==============================

// Get all properties (with optional filters in query params)
router.get("/", getAllProperties);

// Get single property by ID
router.get("/:id", getPropertyById);

// ==============================
// 🔐 PROTECTED ROUTES (Host/Landlord/Admin only)
// ==============================

// Create new property
// Supports: host, landlord, admin roles
// File upload: up to 5 images
router.post(
  "/",
  protect,
  restrictTo("host", "landlord", "admin"),
  upload.array("images", 5),
  createProperty
);

// Update existing property
// Supports: host, landlord, admin roles
// File upload: up to 5 images (can add more or replace existing)
router.put(
  "/:id",
  protect,
  restrictTo("host", "landlord", "admin"),
  upload.array("images", 5),
  updateProperty
);

// Delete entire property
// Supports: host, landlord, admin roles
router.delete(
  "/:id",
  protect,
  restrictTo("host", "landlord", "admin"),
  deleteProperty
);

// Delete specific image from property
// Supports: host, landlord, admin roles
// URL format: /properties/:propertyId/images/:imageUrl
router.delete(
  "/:id/images/:imageUrl",
  protect,
  restrictTo("host", "landlord", "admin"),
  deletePropertyImage
);

module.exports = router;