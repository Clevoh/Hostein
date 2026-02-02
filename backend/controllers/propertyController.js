const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
  try {
    const hostId = req.user.id || req.user._id;

    const data = { ...req.body };
    delete data._id;

    const imagePaths = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

    const property = await Property.create({
      ...data,
      host: hostId,
      images: imagePaths,
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

exports.getMyProperties = async (req, res) => {
  try {
    const hostId = req.user.id || req.user._id;
    const properties = await Property.find({ host: hostId });
    res.json(properties);
  } catch (error) {
    console.error("GET MY PROPERTIES ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;

    // Handle images
    let finalImages = [];

    // Get existing images from request (sent as JSON string)
    if (data.existingImages) {
      try {
        finalImages = JSON.parse(data.existingImages);
      } catch (e) {
        finalImages = [];
      }
      delete data.existingImages;
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);
      finalImages = [...finalImages, ...newImagePaths];
    }

    // Update images array
    data.images = finalImages;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Property deleted" });
};

exports.deletePropertyImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.params;
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.images = property.images.filter(img => img !== decodeURIComponent(imageUrl));
    await property.save();

    res.json({ message: "Image deleted", property });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};