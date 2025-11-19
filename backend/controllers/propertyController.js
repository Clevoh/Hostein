// controllers/propertyController.js
const Property = require("../models/Property");
const User = require("../models/User");

//  CREATE PROPERTY (Host creates listing)
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      country,
      pricePerNight,
      amenities,
      images,
    } = req.body;

    // Host is the authenticated user (later from middleware)
    const hostId = req.body.host || req.user?._id;

    const property = await Property.create({
      title,
      description,
      address,
      city,
      country,
      pricePerNight,
      amenities,
      images,
      host: hostId,
    });

    res
      .status(201)
      .json({ message: "Property created successfully", property });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET ALL PROPERTIES (With filtering like Airbnb)
exports.getAllProperties = async (req, res) => {
  try {
    const { city, country, minPrice, maxPrice } = req.query;

    let filter = {};

    if (city) filter.city = city;
    if (country) filter.country = country;
    if (minPrice || maxPrice)
      filter.pricePerNight = {
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice }),
      };

    const properties = await Property.find(filter).populate(
      "host",
      "name email"
    );

    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//  GET PROPERTY BY ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "host",
      "name email"
    );

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//  UPDATE PROPERTY (Host only)
exports.updateProperty = async (req, res) => {
  try {
    const updates = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//  DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//  GET PROPERTIES BY HOST
exports.getPropertiesByHost = async (req, res) => {
  try {
    const hostId = req.params.hostId;

    const properties = await Property.find({ host: hostId }).populate(
      "host",
      "name email"
    );

    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
