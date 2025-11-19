const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

// CRUD
router.post("/", tenantController.createTenant);
router.get("/", tenantController.getTenants);
router.get("/:id", tenantController.getTenantById);
router.put("/:id", tenantController.updateTenant);
router.delete("/:id", tenantController.deleteTenant);
router.post("/:id/assign", tenantController.assignToProperty);
router.patch("/:id/end-lease", tenantController.endLease);
router.get("/property/:propertyId", tenantController.getTenantsByProperty);

module.exports = router;
