// backend/routes/unitRoute.js
const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");

router.post("/", unitController.createUnit);
router.get("/", unitController.getUnits);
router.get("/property/:propertyId", unitController.getUnitsByProperty);
router.get("/:id", unitController.getUnitById);
router.put("/:id", unitController.updateUnit);
router.delete("/:id", unitController.deleteUnit);

router.post("/:id/assign", unitController.assignTenantToUnit);
router.patch("/:id/vacate", unitController.vacateUnit);

module.exports = router;
