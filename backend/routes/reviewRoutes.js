const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// ============================================================================
// PUBLIC ROUTES (anyone can view reviews)
// ============================================================================
router.get("/property/:propertyId", reviewController.getPropertyReviews);
router.get("/service/:serviceId", reviewController.getServiceReviews);
router.get("/property/:propertyId/stats", reviewController.getPropertyReviewStats);

// ============================================================================
// PROTECTED ROUTES (require authentication)
// ============================================================================
router.use(protect);

// Create review
router.post("/", reviewController.createReview);

// Get my reviews
router.get("/my-reviews", reviewController.getMyReviews);

// Update/Delete review
router.put("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

// Reply to review (host/provider only)
router.post("/:reviewId/reply", reviewController.replyToReview);

module.exports = router;