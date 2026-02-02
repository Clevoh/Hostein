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

// 🔐 Get properties owned by logged-in host
// MUST come before "/:id"
router.get("/mine", protect, getMyProperties);

// 🔐 Get properties by host ID
router.get("/host/:hostId", protect, getPropertiesByHost);

// 🌍 Public routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// 🔐 Create property (Host / Admin only)
router.post(
  "/",
  protect,
  restrictTo("host", "admin"),
  upload.array("images", 5),
  createProperty
);

// 🔐 Update property (Host / Admin only)
router.put(
  "/:id",
  protect,
  restrictTo("host", "admin"),
  upload.array("images", 5),
  updateProperty
);

// 🔐 Delete property (Host / Admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("host", "admin"),
  deleteProperty
);

// 🔐 Delete a specific image from a property
router.delete(
  "/:id/images/:imageUrl",
  protect,
  restrictTo("host", "admin"),
  deletePropertyImage
);

module.exports = router;
