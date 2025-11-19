const Unit = require("../models/Unit");
const Tenant = require("../models/Tenant");

// Create a new unit
exports.createUnit = async (req, res) => {
    try {
        const unit = await Unit.create(req.body);
        res.status(201).json(unit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all units
exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find()
            .populate("property")
            .populate("tenant");

        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get units for a specific property
exports.getUnitsByProperty = async (req, res) => {
    try {
        const units = await Unit.find({ property: req.params.propertyId })
            .populate("tenant");

        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single unit
exports.getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id)
            .populate("property")
            .populate("tenant");

        if (!unit) return res.status(404).json({ message: "Unit not found" });

        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a unit
exports.updateUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!unit) return res.status(404).json({ message: "Unit not found" });

        res.status(200).json(unit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a unit
exports.deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);

        if (!unit) return res.status(404).json({ message: "Unit not found" });

        res.status(200).json({ message: "Unit deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign tenant to unit
exports.assignTenantToUnit = async (req, res) => {
    try {
        const { tenantId } = req.body;

        const unit = await Unit.findById(req.params.id);
        if (!unit) return res.status(404).json({ message: "Unit not found" });

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) return res.status(404).json({ message: "Tenant not found" });

        if (unit.isOccupied) {
            return res.status(400).json({ message: "Unit already occupied" });
        }

        // Assign
        unit.tenant = tenantId;
        unit.isOccupied = true;
        await unit.save();

        // Update tenant
        tenant.unit = unit._id;
        tenant.property = unit.property;
        tenant.isActive = true;
        await tenant.save();

        res.status(200).json({ message: "Tenant assigned to unit", unit });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Vacate a unit
exports.vacateUnit = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id);
        if (!unit) return res.status(404).json({ message: "Unit not found" });

        if (!unit.isOccupied) {
            return res.status(400).json({ message: "Unit is already empty" });
        }

        const tenant = await Tenant.findById(unit.tenant);

        // Unlink tenant
        if (tenant) {
            tenant.unit = null;
            tenant.isActive = false;
            tenant.leaseEnd = Date.now();
            await tenant.save();
        }

        // Reset unit
        unit.tenant = null;
        unit.isOccupied = false;
        await unit.save();

        res.status(200).json({ message: "Unit vacated successfully", unit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
