const ServiceBooking = require("../models/ServiceBooking");
const ServiceOffering = require("../models/ServiceOffering");

// Book a service
exports.bookService = async (req, res) => {
  try {
    const {
      serviceOffering,      //  Accept this (frontend sends this)
      serviceType,
      provider,
      description,
      scheduledDate,
      scheduledTime,
      price,
      duration,
      category,
      notes,
      property,
      unit,
    } = req.body;

    // Validate required fields
    if (!serviceOffering || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        message: "serviceOffering, scheduledDate and scheduledTime are required",
      });
    }

    // Create the service booking
    const booking = await ServiceBooking.create({
      client: req.user._id,
      provider,
      serviceOffering,      //  Use the correct field name
      serviceType,
      description,
      scheduledDate,
      scheduledTime,
      price,
      duration,
      category,
      notes,
      property,
      unit,
      status: "pending",
      paymentStatus: "unpaid",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Book service error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all services (admin)
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceBooking.find()
      .populate("client", "name email")
      .populate("provider", "name email")
      .populate("serviceOffering")
      .populate("property", "title address")
      .populate("unit", "unitNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my services (client)
exports.getMyServices = async (req, res) => {
  try {
    const services = await ServiceBooking.find({ client: req.user._id })
      .populate("provider", "name email")
      .populate("serviceOffering")
      .populate("property", "title address")
      .populate("unit", "unitNumber")
      .sort({ scheduledDate: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await ServiceBooking.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("provider", "name email phone")
      .populate("serviceOffering")
      .populate("property")
      .populate("unit");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const service = await ServiceBooking.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Only allow client or provider to update
    if (
      service.client.toString() !== req.user._id.toString() &&
      service.provider.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedService = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel service
exports.cancelService = async (req, res) => {
  try {
    const service = await ServiceBooking.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Only allow client or admin to cancel
    if (
      service.client.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    service.status = "cancelled";
    await service.save();

    res.status(200).json({
      message: "Service cancelled successfully",
      service,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reschedule service
exports.rescheduleService = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime } = req.body;

    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({
        message: "scheduledDate and scheduledTime are required",
      });
    }

    const service = await ServiceBooking.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Only allow client or provider to reschedule
    if (
      service.client.toString() !== req.user._id.toString() &&
      service.provider.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    service.scheduledDate = scheduledDate;
    service.scheduledTime = scheduledTime;
    await service.save();

    res.status(200).json({
      message: "Service rescheduled successfully",
      service,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service booking
exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceBooking.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Only allow client who made the booking or admin to delete
    if (
      service.client.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this service" });
    }

    await ServiceBooking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};