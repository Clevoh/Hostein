// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Client routes
router.get("/my-services", serviceController.getMyServices);

// General routes
router.post("/book",              serviceController.bookService);
router.get("/:id",                serviceController.getServiceById);
router.put("/:id",                serviceController.updateService);
router.patch("/:id/cancel",       serviceController.cancelService);
router.patch("/:id/reschedule",   serviceController.rescheduleService);

//  DELETE ROUTE - Permanently remove service booking
router.delete("/:id", serviceController.deleteService);

// Admin routes
router.get("/", serviceController.getAllServices);

module.exports = router;