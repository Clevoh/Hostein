const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesByHost,
} = require("../controllers/propertyController");

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.get("/host/:hostId", auth, getPropertiesByHost);

router.post("/", auth, restrictTo("host", "admin"), createProperty);
router.put("/:id", auth, restrictTo("host", "admin"), updateProperty);
router.delete("/:id", auth, restrictTo("admin"), deleteProperty);

module.exports = router;
