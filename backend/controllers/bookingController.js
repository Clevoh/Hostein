// backend/controllers/bookingController.js
// FIXED: sendNotification reads userSockets from app (not global),
//        iterates a Set<socketId>, notifies both host AND client on booking creation.

const Booking  = require("../models/Booking");
const Property = require("../models/Property");
const Unit     = require("../models/Unit");
const User     = require("../models/User");

// ─── Shared deep-populate array ───────────────────────────────────────────────
const POPULATE_BOOKING = [
  { path: "client", select: "_id name email phone" },
  {
    path: "property",
    select: "title address city images pricePerNight rentType host",
    populate: { path: "host", select: "_id name email phone" },
  },
  { path: "unit", select: "_id unitNumber unitType rentAmount" },
];

// ─── Helper: send Socket.io notification ──────────────────────────────────────
// userSockets is Map<userId string, Set<socketId string>>
const sendNotification = (io, userSockets, userId, notification) => {
  if (!io || !userSockets) {
    console.warn("⚠️ io or userSockets not available");
    return;
  }

  const uid     = userId.toString();
  const sockets = userSockets.get(uid);

  if (sockets && sockets.size > 0) {
    sockets.forEach((socketId) => {
      io.to(socketId).emit("notification", notification);
    });
    console.log(`📨 Notification → user ${uid} (${sockets.size} socket(s)): "${notification.title}"`);
  } else {
    console.log(`⚠️ User ${uid} offline — notification not delivered in real-time`);
  }
};

// ─── Internal shorthand ───────────────────────────────────────────────────────
const getSocket = (req) => ({
  io:          req.app.get("io"),
  userSockets: req.app.get("userSockets"),
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (client)
exports.createBooking = async (req, res) => {
  try {
    const { property, unit, checkIn, checkOut, guests, notes } = req.body;

    if (!property || !checkIn || !checkOut) {
      return res.status(400).json({ message: "property, checkIn and checkOut are required" });
    }

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) return res.status(404).json({ message: "Property not found" });

    let unitDoc = null;
    if (unit) {
      unitDoc = await Unit.findById(unit);
      if (!unitDoc) return res.status(404).json({ message: "Unit not found" });
    }

    let amount = 0;
    if (propertyDoc.rentType === "daily" && propertyDoc.pricePerNight) {
      amount = nights * propertyDoc.pricePerNight;
    } else if (unitDoc?.rentAmount) {
      amount = Math.ceil(nights / 30) * unitDoc.rentAmount;
    } else if (propertyDoc.pricePerNight) {
      amount = nights * propertyDoc.pricePerNight;
    }

    const booking = await Booking.create({
      client:        req.user._id,
      property,
      unit:          unit || null,
      checkIn:       checkInDate,
      checkOut:      checkOutDate,
      guests:        guests || 1,
      nights,
      amount,
      notes:         notes || "",
      status:        "pending",
      paymentStatus: "unpaid",
    });

    const populated = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    console.log(`✅ Booking created: ${booking._id}`);

    const { io, userSockets } = getSocket(req);

    // 🔔 Notify the host
    const hostId = (propertyDoc.host?._id || propertyDoc.host)?.toString();
    if (hostId) {
      sendNotification(io, userSockets, hostId, {
        type:      "booking",
        title:     "New Booking Request",
        message:   `${populated.client.name} booked ${populated.property.title} for ${nights} night(s)`,
        bookingId: booking._id.toString(),
        timestamp: new Date(),
      });
    }

    // 🔔 Notify the client (confirmation feedback)
    sendNotification(io, userSockets, req.user._id.toString(), {
      type:      "success",
      title:     "Booking Submitted",
      message:   `Your booking for ${populated.property.title} has been submitted and is pending approval.`,
      bookingId: booking._id.toString(),
      timestamp: new Date(),
    });

    // 🔔 Notify admins
    const admins = await User.find({ role: "admin" }).select("_id");
    admins.forEach((admin) => {
      sendNotification(io, userSockets, admin._id.toString(), {
        type:      "booking",
        title:     "New Booking Request",
        message:   `${populated.client.name} booked ${populated.property.title}`,
        bookingId: booking._id.toString(),
        timestamp: new Date(),
      });
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(POPULATE_BOOKING).sort("-createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client's own bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate(POPULATE_BOOKING)
      .sort("-createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get host's bookings for their properties
// @route   GET /api/bookings/host-bookings
exports.getHostBookings = async (req, res) => {
  try {
    const properties  = await Property.find({ host: req.user._id }).select("_id");
    const propertyIds = properties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate(POPULATE_BOOKING)
      .sort("-createdAt");

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const clientId = (booking.client?._id || booking.client).toString();
    const hostId   = (booking.property?.host?._id || booking.property?.host || "").toString();

    if (
      req.user._id.toString() !== clientId &&
      req.user._id.toString() !== hostId   &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { checkIn, checkOut, paymentStatus, status, notes } = req.body;

    if (checkIn || checkOut) {
      const newCheckIn  = checkIn  ? new Date(checkIn)  : booking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : booking.checkOut;

      if (newCheckOut <= newCheckIn) {
        return res.status(400).json({ message: "Check-out must be after check-in" });
      }

      const nights   = Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24));
      const property = await Property.findById(booking.property);
      const unit     = await Unit.findById(booking.unit);

      let amount = 0;
      if (property?.rentType === "daily" && property?.pricePerNight) {
        amount = nights * property.pricePerNight;
      } else if (unit?.rentAmount) {
        amount = Math.ceil(nights / 30) * unit.rentAmount;
      }

      booking.checkIn  = newCheckIn;
      booking.checkOut = newCheckOut;
      booking.nights   = nights;
      booking.amount   = amount;
    }

    if (paymentStatus !== undefined) booking.paymentStatus = paymentStatus;
    if (status        !== undefined) booking.status        = status;
    if (notes         !== undefined) booking.notes         = notes;

    await booking.save();
    const updated = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm booking (host action)
// @route   PATCH /api/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be confirmed" });
    }

    booking.status = "confirmed";
    await booking.save();

    const updated             = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    const { io, userSockets } = getSocket(req);

    // 🔔 Notify client
    sendNotification(io, userSockets, updated.client._id.toString(), {
      type:      "success",
      title:     "Booking Confirmed! 🎉",
      message:   `Your booking for ${updated.property.title} has been confirmed!`,
      bookingId: updated._id.toString(),
      timestamp: new Date(),
    });

    res.json({ message: "Booking confirmed successfully", booking: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    const updated             = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    const { io, userSockets } = getSocket(req);

    const clientId = updated.client._id.toString();
    const hostId   = (updated.property?.host?._id || updated.property?.host || "").toString();

    // 🔔 Notify the other party
    if (req.user._id.toString() === clientId) {
      sendNotification(io, userSockets, hostId, {
        type:      "warning",
        title:     "Booking Cancelled",
        message:   `${updated.client.name} cancelled their booking for ${updated.property.title}`,
        bookingId: updated._id.toString(),
        timestamp: new Date(),
      });
    } else {
      sendNotification(io, userSockets, clientId, {
        type:      "warning",
        title:     "Booking Cancelled",
        message:   `Your booking for ${updated.property.title} has been cancelled by the host`,
        bookingId: updated._id.toString(),
        timestamp: new Date(),
      });
    }

    res.json({ message: "Booking cancelled successfully", booking: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking permanently
// @route   DELETE /api/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "pending" || booking.status === "confirmed") {
      return res.status(400).json({ message: "Cannot delete active bookings. Cancel first." });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
exports.getBookingStats = async (req, res) => {
  try {
    const stats        = await Booking.aggregate([{ $group: { _id: "$status",        count: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } }]);
    const paymentStats = await Booking.aggregate([{ $group: { _id: "$paymentStatus", count: { $sum: 1 }, totalAmount:  { $sum: "$amount" } } }]);
    res.json({ stats, paymentStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete booking
// @route   PATCH /api/bookings/:id/complete
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const hostId = (booking.property?.host?._id || booking.property?.host || "").toString();
    if (hostId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.status = "completed";
    await booking.save();

    const updated = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    res.json({ success: true, message: "Booking marked as completed", booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status
// @route   PATCH /api/bookings/:id/payment
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!["paid", "unpaid", "partial"].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }

    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const hostId = (booking.property?.host?._id || booking.property?.host || "").toString();
    if (hostId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    const updated = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    res.json({ success: true, message: `Payment status updated to: ${paymentStatus}`, booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Extend booking checkout date
// @route   PATCH /api/bookings/:id/extend
exports.extendBooking = async (req, res) => {
  try {
    const { newCheckOut } = req.body;
    if (!newCheckOut) return res.status(400).json({ success: false, message: "New checkout date is required" });

    const booking = await Booking.findById(req.params.id).populate(POPULATE_BOOKING);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const hostId = (booking.property?.host?._id || booking.property?.host || "").toString();
    if (hostId !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const newCheckOutDate = new Date(newCheckOut);
    if (newCheckOutDate <= new Date(booking.checkOut)) {
      return res.status(400).json({ success: false, message: "New checkout date must be after current checkout date" });
    }

    const nights    = Math.ceil((newCheckOutDate - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
    const unitDoc   = await Unit.findById(booking.unit);
    const newAmount = unitDoc?.rentAmount ? unitDoc.rentAmount * nights : booking.amount;

    booking.checkOut      = newCheckOutDate;
    booking.nights        = nights;
    booking.amount        = newAmount;
    booking.paymentStatus = "unpaid";
    await booking.save();

    const updated = await Booking.findById(booking._id).populate(POPULATE_BOOKING);
    res.json({ success: true, message: "Booking extended successfully", booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;