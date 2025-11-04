// controllers/propertyController.js
const Property = require('../models/Property');
const User = require('../models/User');

// 🏠 CREATE PROPERTY
exports.createProperty = async (req, res) => {
  try {
    const { title, description, address, city, country, pricePerNight, amenities, images } = req.body;
    const hostId = req.body.host || req.user?._id; // later from auth middleware

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

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📋 GET ALL PROPERTIES
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('host', 'name email');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔍 GET PROPERTY BY ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('host', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✏️ UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🗑️ DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};