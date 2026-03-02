const mongoose = require("mongoose");
const ServiceOffering = require("../models/ServiceOffering");

/* ============================= */
/* GET MY OFFERINGS (Provider) */
/* ============================= */
exports.getMyOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({
      provider: req.user._id,
    })
      .sort({ createdAt: -1 });

    res.status(200).json(offerings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch offerings" });
  }
};

/* ============================= */
/* GET ACTIVE OFFERINGS (Public) */
/* ============================= */
exports.getActiveOfferings = async (req, res) => {
  try {
    const offerings = await ServiceOffering.find({ isActive: true })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(offerings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active offerings" });
  }
};

/* ============================= */
/* GET OFFERING BY ID (Public) */
/* ============================= */
exports.getOfferingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const offering = await ServiceOffering.findById(id)
      .populate("provider", "name email");

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    // Only allow viewing if active
    if (!offering.isActive) {
      return res.status(404).json({ message: "Service not available" });
    }

    res.status(200).json(offering);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service offering" });
  }
};

/* ============================= */
/* CREATE OFFERING (Provider) */
/* ============================= */
exports.createOffering = async (req, res) => {
  try {
    const { name, description, category, price, duration, features } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const offering = await ServiceOffering.create({
      provider: req.user._id,
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      duration,
      features: Array.isArray(features) ? features : [],
      isActive: true,
    });

    res.status(201).json(offering);
  } catch (error) {
    res.status(400).json({ message: "Failed to create offering" });
  }
};

/* ============================= */
/* UPDATE OFFERING */
/* ============================= */
exports.updateOffering = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const offering = await ServiceOffering.findById(id);

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    if (
      offering.provider.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent provider field from being modified
    delete req.body.provider;

    const updatedOffering = await ServiceOffering.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOffering);
  } catch (error) {
    res.status(400).json({ message: "Failed to update offering" });
  }
};

/* ============================= */
/* DELETE OFFERING */
/* ============================= */
exports.deleteOffering = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const offering = await ServiceOffering.findById(id);

    if (!offering) {
      return res.status(404).json({ message: "Service offering not found" });
    }

    if (
      offering.provider.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ServiceOffering.findByIdAndDelete(id);

    res.status(200).json({ message: "Service offering deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete offering" });
  }
};