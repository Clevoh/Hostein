const Service = require("../models/Service");

// Get client's services
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ client: req.user._id })
      .populate("property", "title city")
      .populate("unit", "unitNumber")
      .sort({ scheduledDate: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all services (admin/host)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("client", "name email")
      .populate("property", "title city")
      .populate("unit", "unitNumber")
      .sort({ scheduledDate: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available services (catalog)
exports.getAvailableServices = async (req, res) => {
  try {
    // This would typically come from a database
    // For now, return static data
    const services = [
      {
        id: "ac-maintenance",
        name: "AC Maintenance",
        description: "Regular AC servicing and cleaning",
        category: "maintenance",
        price: 80,
        duration: "2 hours",
        rating: 4.8,
      },
      {
        id: "plumbing",
        name: "Plumbing Service",
        description: "Fix leaks, unclog drains, repair pipes",
        category: "maintenance",
        price: 100,
        duration: "1-3 hours",
        rating: 4.7,
      },
      {
        id: "electrical",
        name: "Electrical Repair",
        description: "Fix wiring, outlets, and lighting issues",
        category: "maintenance",
        price: 90,
        duration: "1-2 hours",
        rating: 4.9,
      },
      {
        id: "deep-cleaning",
        name: "Deep Cleaning",
        description: "Thorough cleaning of entire property",
        category: "cleaning",
        price: 150,
        duration: "3-4 hours",
        rating: 4.6,
      },
      {
        id: "regular-cleaning",
        name: "Regular Cleaning",
        description: "Weekly or bi-weekly cleaning service",
        category: "cleaning",
        price: 60,
        duration: "2 hours",
        rating: 4.5,
      },
      {
        id: "move-service",
        name: "Move-in/Move-out",
        description: "Complete property preparation service",
        category: "other",
        price: 200,
        duration: "4-5 hours",
        rating: 4.8,
      },
    ];

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("property", "title city")
      .populate("unit", "unitNumber");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      service.client._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a service
exports.bookService = async (req, res) => {
  try {
    const {
      serviceType,
      provider,
      description,
      scheduledDate,
      scheduledTime,
      price,
      duration,
      category,
      property,
      unit,
      notes,
    } = req.body;

    if (!serviceType || !scheduledDate || !scheduledTime || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.create({
      client: req.user._id,
      serviceType,
      provider: provider || "Default Provider",
      description,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      price,
      duration,
      category,
      property: property || null,
      unit: unit || null,
      notes,
      status: "scheduled",
    });

    const populatedService = await Service.findById(service._id)
      .populate("property", "title city")
      .populate("unit", "unitNumber");

    res.status(201).json(populatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      service.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Don't allow updating completed or cancelled services
    if (["completed", "cancelled"].includes(service.status)) {
      return res
        .status(400)
        .json({ message: `Cannot update ${service.status} service` });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("property", "title city")
      .populate("unit", "unitNumber");

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel service
exports.cancelService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      service.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (service.status === "cancelled") {
      return res.status(400).json({ message: "Service already cancelled" });
    }

    if (service.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed service" });
    }

    service.status = "cancelled";
    await service.save();

    res.status(200).json({ message: "Service cancelled successfully", service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reschedule service
exports.rescheduleService = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check authorization
    if (
      req.user.role === "client" &&
      service.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["scheduled", "in-progress"].includes(service.status)) {
      return res
        .status(400)
        .json({ message: "Cannot reschedule this service" });
    }

    service.scheduledDate = new Date(scheduledDate);
    service.scheduledTime = scheduledTime;
    await service.save();

    res.status(200).json({ message: "Service rescheduled successfully", service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};