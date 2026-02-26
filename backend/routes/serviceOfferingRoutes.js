const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyOfferings,
  getActiveOfferings,
  getOfferingById,
  createOffering,
  updateOffering,
  deleteOffering,
} = require("../controllers/ServiceOfferingController");

// All routes require authentication
router.use(protect);

// Client routes - browse active offerings
router.get("/active", getActiveOfferings);

// Host routes - manage their offerings
router.get("/", getMyOfferings);
router.post("/", createOffering);
router.get("/:id", getOfferingById);
router.put("/:id", updateOffering);
router.delete("/:id", deleteOffering);

module.exports = router;