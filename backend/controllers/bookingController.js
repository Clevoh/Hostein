const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Unit = require("../models/Unit");

// Get client's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate("property", "title city images")
      .populate("unit", "unitNumber unitType")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (admin/host)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("client", "name email")
      .populate("property", "title city")
      .populate("unit", "unitNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("property")
      .populate("unit");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (
      req.user.role === "client" &&
      booking.client._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { property, unit, checkIn, checkOut, notes } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    // Calculate nights
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    // Get property and unit details
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({ message: "Property not found" });
    }

    let amount;
    if (unit) {
      const unitDoc = await Unit.findById(unit);
      if (!unitDoc) {
        return res.status(404).json({ message: "Unit not found" });
      }
      amount = unitDoc.rentAmount * nights;
    } else {
      // Use property base price if no unit specified
      amount = propertyDoc.price * nights;
    }

    const booking = await Booking.create({
      client: req.user._id,
      property,
      unit: unit || null,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      amount,
      notes,
      status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("property", "title city images")
      .populate("unit", "unitNumber unitType");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      booking.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Don't allow updating completed or cancelled bookings
    if (["completed", "cancelled"].includes(booking.status)) {
      return res
        .status(400)
        .json({ message: `Cannot update ${booking.status} booking` });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("property", "title city images")
      .populate("unit", "unitNumber unitType");

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      booking.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Confirm booking (host/admin)
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be confirmed" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = {
      totalBookings: await Booking.countDocuments({ client: userId }),
      upcomingBookings: await Booking.countDocuments({
        client: userId,
        status: { $in: ["confirmed", "pending"] },
        checkIn: { $gte: new Date() },
      }),
      pastBookings: await Booking.countDocuments({
        client: userId,
        status: { $in: ["completed", "cancelled"] },
      }),
      totalSpent: 0,
    };

    // Calculate total spent on completed bookings
    const completedBookings = await Booking.find({
      client: userId,
      status: "completed",
    });

    stats.totalSpent = completedBookings.reduce(
      (sum, booking) => sum + booking.amount,
      0
    );

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};