const mongoose = require("mongoose");
const ServiceOffering = require("../models/ServiceOffering");

exports.getMyOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({
      provider: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(offerings);
  } catch {
    res.status(500).json({ message: "Failed to fetch offerings" });
  }
};

exports.getActiveOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({ isActive: true })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json(offerings);
  } catch {
    res.status(500).json({ message: "Failed to fetch active offerings" });
  }
};

exports.getOfferingById = async (req, res) => {
  try {
    const offering = await ServiceOffering.findById(req.params.id)
      .populate("provider", "name email");

    if (!offering || !offering.isActive)
      return res.status(404).json({ message: "Service not found" });

    res.json(offering);
  } catch {
    res.status(500).json({ message: "Failed to fetch offering" });
  }
};

exports.createOffering = async (req, res) => {
  try {
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/services/${req.file.filename}`;
    }

    const offering = await ServiceOffering.create({
      provider: req.user._id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      duration: req.body.duration,
      features: [],
      isActive: true,
      images: imagePath ? [imagePath] : [],
    });

    res.status(201).json(offering);
  } catch (error) {
    res.status(400).json({ message: "Failed to create offering" });
  }
};

exports.updateOffering = async (req, res) => {
  try {
    const offering = await ServiceOffering.findById(req.params.id);
    if (!offering)
      return res.status(404).json({ message: "Not found" });

    if (
      offering.provider.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.file) {
      offering.images = [
        `/uploads/services/${req.file.filename}`,
      ];
    }

    offering.name = req.body.name || offering.name;
    offering.description =
      req.body.description || offering.description;
    offering.category = req.body.category || offering.category;
    offering.price = req.body.price || offering.price;
    offering.duration = req.body.duration || offering.duration;

    await offering.save();
    res.json(offering);
  } catch {
    res.status(400).json({ message: "Failed to update offering" });
  }
};

exports.deleteOffering = async (req, res) => {
  try {
    await ServiceOffering.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};