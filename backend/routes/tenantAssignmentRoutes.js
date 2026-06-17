// backend/routes/tenantAssignmentRoutes.js
// NEW ROUTES for tenant assignment by landlords

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  assignClientAsTenant,
  getMyTenantAssignment,
  removeTenantAssignment,
  getMyTenants
} = require("../controllers/tenantAssignmentController");

// ═══════════════════════════════════════════════════════════════
// LANDLORD/HOST ROUTES - Manage tenant assignments
// ═══════════════════════════════════════════════════════════════

// Assign a client as tenant (by email)
// Landlord/Host adds a client to a unit by their email address
router.post(
  "/assign",
  protect,
  restrictTo("host", "landlord", "admin"),
  assignClientAsTenant
);

// Get all my tenants
// Returns all tenants assigned to landlord's properties
router.get(
  "/my-tenants",
  protect,
  restrictTo("host", "landlord", "admin"),
  getMyTenants
);

// Remove tenant assignment
// Marks unit as vacant and removes client's assignment
router.delete(
  "/:tenantId",
  protect,
  restrictTo("host", "landlord", "admin"),
  removeTenantAssignment
);

// ═══════════════════════════════════════════════════════════════
// CLIENT ROUTES - View own assignment
// ═══════════════════════════════════════════════════════════════

// Get my tenant assignment
// Client checks if they've been assigned a unit by a landlord
router.get(
  "/my-assignment",
  protect,
  getMyTenantAssignment
);

module.exports = router;