const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
  try {
    const hostId = req.user.id || req.user._id;

    const data = { ...req.body };
    delete data._id; // 🔥 IMPORTANT

    const property = await Property.create({
      ...data,
      host: hostId,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate property detected",
      });
    }

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

exports.getAllProperties = async (req, res) => {
  const properties = await Property.find().populate("host", "name email");
  res.json(properties);
};

exports.getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  res.json(property);
};

exports.getPropertiesByHost = async (req, res) => {
  const properties = await Property.find({ host: req.params.hostId });
  res.json(properties);
};

exports.updateProperty = async (req, res) => {
  const data = { ...req.body };
  delete data._id; // 🔥 IMPORTANT

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true }
  );

  res.json(property);
};

exports.deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Property deleted" });
};
