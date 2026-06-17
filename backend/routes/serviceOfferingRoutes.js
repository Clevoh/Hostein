const express = require("express");
const router = express.Router();
const {
  getMyOfferings,
  getActiveOfferings,
  getOfferingById,
  createOffering,
  updateOffering,
  deleteOffering,
} = require("../controllers/ServiceOfferingController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadServiceMiddleware");

// Public
router.get("/active", getActiveOfferings);
router.get("/:id", getOfferingById);

// Provider
router.get("/", protect, getMyOfferings);
router.post("/", protect, upload.single("image"), createOffering);
router.put("/:id", protect, upload.single("image"), updateOffering);
router.delete("/:id", protect, deleteOffering);

module.exports = router;