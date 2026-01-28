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
  getMyProperties, //  NEW IMPORT
} = require("../controllers/propertyController");

//  NEW: Must come BEFORE "/:id" route to avoid conflicts
router.get("/mine", auth, getMyProperties);

// Existing routes
router.get("/host/:hostId", auth, getPropertiesByHost);
router.get("/:id", getPropertyById);
router.get("/", getAllProperties);

router.post("/", auth, restrictTo("host", "admin"), createProperty);
router.put("/:id", auth, restrictTo("host", "admin"), updateProperty);
router.delete("/:id", auth, restrictTo("admin"), deleteProperty);

module.exports = router;