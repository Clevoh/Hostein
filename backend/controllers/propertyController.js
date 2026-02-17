const Property = require("../models/Property");

// Helper to safely parse JSON strings from FormData
const parseJSON = (value, fallback = []) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

exports.createProperty = async (req, res) => {
  try {
    const hostId = req.user.id || req.user._id;

    // Start with a clean object - only pick fields we need
    const {
      title,
      description,
      address,
      city,
      country,
      category,
      rentType,
      pricePerNight,
      hostelType,
    } = req.body;

    // Parse array/object fields from FormData strings
    const amenities = parseJSON(req.body.amenities, []);
    const mealPlans = parseJSON(req.body.mealPlans, []);

    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/properties/${file.filename}`)
      : [];

    // Build property data object cleanly
    const propertyData = {
      title,
      description,
      address,
      city,
      country,
      category,
      rentType,
      host: hostId,
      images: imagePaths,
      amenities,
      isAvailable: true,
    };

    // Only add price if daily
    if (rentType === "daily" && pricePerNight) {
      propertyData.pricePerNight = Number(pricePerNight);
    }

    // Only add hostel fields if category is hostel
    if (category === "hostel") {
      propertyData.hostelType = hostelType || "accommodation_only";
      // Only add meal plans that have a name filled in
      propertyData.mealPlans = mealPlans.filter((plan) => plan.name);
    }

    const property = await Property.create(propertyData);

    res.status(201).json(property);
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate property detected" });
    }

    res.status(500).json({ message: error.message || "Server error" });
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
    const {
      title,
      description,
      address,
      city,
      country,
      category,
      rentType,
      pricePerNight,
      hostelType,
    } = req.body;

    // Parse array fields
    const amenities = parseJSON(req.body.amenities, []);
    const mealPlans = parseJSON(req.body.mealPlans, []);

    // Handle images
    let finalImages = [];
    const existingImages = parseJSON(req.body.existingImages, []);
    finalImages = [...existingImages];

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(
        (file) => `/uploads/properties/${file.filename}`
      );
      finalImages = [...finalImages, ...newImagePaths];
    }

    // Build update object cleanly
    const updateData = {
      title,
      description,
      address,
      city,
      country,
      category,
      rentType,
      amenities,
      images: finalImages,
    };

    if (rentType === "daily" && pricePerNight) {
      updateData.pricePerNight = Number(pricePerNight);
    }

    if (category === "hostel") {
      updateData.hostelType = hostelType || "accommodation_only";
      updateData.mealPlans = mealPlans.filter((plan) => plan.name);
    } else {
      // Clear hostel fields if not a hostel
      updateData.hostelType = undefined;
      updateData.mealPlans = [];
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
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

    property.images = property.images.filter(
      (img) => img !== decodeURIComponent(imageUrl)
    );
    await property.save();

    res.json({ message: "Image deleted", property });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};