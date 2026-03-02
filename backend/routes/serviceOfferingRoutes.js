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

/* ============================= */
/* PUBLIC ROUTES */
/* ============================= */

// Anyone can browse active services
router.get("/active", getActiveOfferings);

// Anyone can view a single offering
router.get("/:id", getOfferingById);

/* ============================= */
/* PROTECTED ROUTES */
/* ============================= */

// Everything below requires login
router.use(protect);

// Provider manages own offerings
router.get("/", getMyOfferings);
router.post("/", createOffering);
router.put("/:id", updateOffering);
router.delete("/:id", deleteOffering);

module.exports = router;