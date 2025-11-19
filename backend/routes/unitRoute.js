const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");

// CRUD
router.post("/", unitController.createUnit);
router.get("/", unitController.getUnits);
router.get("/property/:propertyId", unitController.getUnitsByProperty);
router.get("/:id", unitController.getUnitById);
router.put("/:id", unitController.updateUnit);
router.delete("/:id", unitController.deleteUnit);

// Tenant assignment
router.post("/:id/assign", unitController.assignTenantToUnit);

// Vacate
router.patch("/:id/vacate", unitController.vacateUnit);

module.exports = router;