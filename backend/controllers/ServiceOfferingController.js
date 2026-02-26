const ServiceOffering = require("../models/ServiceOffering");

// Get all service offerings (host's own offerings)
exports.getMyOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({ provider: req.user._id }).sort({ createdAt: -1 });
    res.json(offerings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all active service offerings (for clients to browse)
exports.getActiveOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({ isActive: true })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    res.json(offerings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single service offering
exports.getOfferingById = async (req, res) => {
  try {
    const offering = await ServiceOffering.findById(req.params.id).populate("provider", "name email");
    
    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    res.json(offering);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create service offering (host only)
exports.createOffering = async (req, res) => {
  try {
    const { name, description, category, price, duration, features, isActive } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const offering = await ServiceOffering.create({
      provider: req.user._id,
      name,
      description,
      category,
      price: Number(price),
      duration,
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(offering);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update service offering
exports.updateOffering = async (req, res) => {
  try {
    const offering = await ServiceOffering.findById(req.params.id);

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    // Check if user owns this offering
    if (offering.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this offering" });
    }

    const updatedOffering = await ServiceOffering.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedOffering);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service offering
exports.deleteOffering = async (req, res) => {
  try {
    const offering = await ServiceOffering.findById(req.params.id);

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    // Check if user owns this offering
    if (offering.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this offering" });
    }

    await ServiceOffering.findByIdAndDelete(req.params.id);

    res.json({ message: "Service offering deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};