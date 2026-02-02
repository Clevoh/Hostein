const mongoose = require("mongoose");
const Unit = require("../models/Unit");
const Property = require("../models/Property");
const Tenant = require("../models/Tenant");

/* ===========================
   CREATE UNIT
=========================== */
exports.createUnit = async (req, res) => {
  try {
    const {
      unitNumber,
      unitType,
      bedrooms,
      bathrooms,
      rentAmount,
      property,
    } = req.body;

    //  Validate required fields
    if (
      !unitNumber ||
      !unitType ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      rentAmount === undefined ||
      !property
    ) {
      return res.status(400).json({
        message: "All unit fields are required",
      });
    }

    //  Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({
        message: "Invalid property ID",
      });
    }

    //  Ensure property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const unit = await Unit.create({
      unitNumber,
      unitType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      rentAmount: Number(rentAmount),
      property,
    });

    res.status(201).json(unit);
  } catch (error) {
    //  Handle duplicate unit numbers
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Unit number already exists for this property",
      });
    }

    console.error("CREATE UNIT ERROR:", error);
    res.status(500).json({
      message: "Failed to create unit",
    });
  }
};

/* ===========================
   GET ALL UNITS
=========================== */
exports.getUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate("property", "title")
      .populate("tenant", "name");

    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   GET UNITS BY PROPERTY
=========================== */
exports.getUnitsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        message: "Invalid property ID",
      });
    }

    const units = await Unit.find({ property: propertyId }).populate(
      "tenant",
      "name"
    );

    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   GET UNIT BY ID
=========================== */
exports.getUnitById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid unit ID" });
    }

    const unit = await Unit.findById(req.params.id)
      .populate("property", "title")
      .populate("tenant", "name");

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   UPDATE UNIT
=========================== */
exports.updateUnit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid unit ID" });
    }

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json(unit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===========================
   DELETE UNIT
=========================== */
exports.deleteUnit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid unit ID" });
    }

    const unit = await Unit.findByIdAndDelete(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   ASSIGN TENANT TO UNIT
=========================== */
exports.assignTenantToUnit = async (req, res) => {
  try {
    const { tenantId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      !mongoose.Types.ObjectId.isValid(tenantId)
    ) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    if (unit.isOccupied) {
      return res.status(400).json({ message: "Unit already occupied" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    unit.tenant = tenantId;
    unit.isOccupied = true;
    await unit.save();

    tenant.unit = unit._id;
    tenant.property = unit.property;
    tenant.isActive = true;
    await tenant.save();

    res.status(200).json({ message: "Tenant assigned", unit });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ===========================
   DELETE UNIT IMAGE
=========================== */
exports.deleteUnitImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid unit ID" });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    if (!unit.images || !unit.images.includes(imageUrl)) {
      return res.status(404).json({ message: "Image not found on unit" });
    }

    unit.images = unit.images.filter(img => img !== imageUrl);
    await unit.save();

    res.status(200).json({
      message: "Image removed successfully",
      unit,
    });
  } catch (error) {
    console.error("DELETE UNIT IMAGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   VACATE UNIT
=========================== */
exports.vacateUnit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid unit ID" });
    }

    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    if (!unit.isOccupied) {
      return res.status(400).json({ message: "Unit already vacant" });
    }

    const tenant = await Tenant.findById(unit.tenant);

    if (tenant) {
      tenant.unit = null;
      tenant.isActive = false;
      tenant.leaseEnd = new Date();
      await tenant.save();
    }

    unit.tenant = null;
    unit.isOccupied = false;
    await unit.save();

    res.status(200).json({ message: "Unit vacated", unit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
