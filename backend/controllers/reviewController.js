const Review = require("../models/Review");
const Property = require("../models/Property");
const ServiceOffering = require("../models/ServiceOffering");

// ============================================================================
// CREATE REVIEW
// ============================================================================
exports.createReview = async (req, res) => {
  try {
    const { propertyId, serviceId, serviceBookingId, rating, comment } = req.body;

    console.log("📝 Create review request:", {
      propertyId,
      serviceId,
      serviceBookingId,
      rating,
      userId: req.user._id
    });

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check what is being reviewed
    if (!propertyId && !serviceId && !serviceBookingId) {
      return res.status(400).json({
        success: false,
        message: "Must specify propertyId, serviceId, or serviceBookingId"
      });
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({
      user: req.user._id,
      $or: [
        propertyId ? { property: propertyId } : {},
        serviceId ? { serviceOffering: serviceId } : {},
        serviceBookingId ? { serviceBooking: serviceBookingId } : {},
      ].filter(obj => Object.keys(obj).length > 0)
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this"
      });
    }

    // Create review
    const reviewData = {
      user: req.user._id,
      rating,
      comment: comment || "",
      status: "active",
    };

    if (propertyId) reviewData.property = propertyId;
    if (serviceId) reviewData.serviceOffering = serviceId;
    if (serviceBookingId) reviewData.serviceBooking = serviceBookingId;

    const review = await Review.create(reviewData);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("property", "title")
      .populate("serviceOffering", "name");

    console.log("✅ Review created:", review._id);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("❌ CREATE REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review"
    });
  }
};

// ============================================================================
// GET PROPERTY REVIEWS
// ============================================================================
exports.getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({
      property: propertyId,
      status: "active"
    })
      .populate("user", "name email")
      .populate("repliedBy", "name")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    });
  } catch (error) {
    console.error("GET PROPERTY REVIEWS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// GET SERVICE REVIEWS
// ============================================================================
exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({
      serviceOffering: serviceId,
      status: "active"
    })
      .populate("user", "name email")
      .populate("repliedBy", "name")
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      reviews,
    });
  } catch (error) {
    console.error("GET SERVICE REVIEWS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// GET MY REVIEWS (reviews written by current user)
// ============================================================================
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("property", "title images")
      .populate("serviceOffering", "name images")
      .populate("repliedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// UPDATE REVIEW
// ============================================================================
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Only the review author can update
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5"
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("property", "title")
      .populate("serviceOffering", "name");

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// DELETE REVIEW
// ============================================================================
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Only the review author or admin can delete
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// REPLY TO REVIEW (Host/Provider only)
// ============================================================================
exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required"
      });
    }

    const review = await Review.findById(reviewId)
      .populate("property")
      .populate("serviceOffering");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check authorization
    let isAuthorized = false;

    if (review.property) {
      const property = review.property;
      isAuthorized = property.host.toString() === req.user._id.toString();
    } else if (review.serviceOffering) {
      const service = review.serviceOffering;
      isAuthorized = service.provider.toString() === req.user._id.toString();
    }

    if (!isAuthorized && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reply to this review"
      });
    }

    review.reply = reply.trim();
    review.repliedAt = new Date();
    review.repliedBy = req.user._id;
    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate("user", "name email")
      .populate("repliedBy", "name");

    res.json({
      success: true,
      message: "Reply added successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("REPLY TO REVIEW ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================================================
// GET REVIEW STATS FOR PROPERTY
// ============================================================================
exports.getPropertyReviewStats = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({
      property: propertyId,
      status: "active"
    });

    const stats = {
      totalReviews: reviews.length,
      averageRating: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      }
    };

    if (reviews.length > 0) {
      stats.averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      reviews.forEach(r => {
        stats.ratingDistribution[r.rating]++;
      });
    }

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("GET REVIEW STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};