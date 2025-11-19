const Tenant = require('../models/Tenant');

// Create a new tenant
exports.createTenant = async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);
        res.status(201).json(tenant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tenants
exports.getTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find()
            .populate('property')
            .populate('unit');

        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id)
            .populate('property')
            .populate('unit');

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tenant by ID
exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json(tenant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a tenant
exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndDelete(req.params.id);

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign tenant to property + unit
exports.assignToProperty = async (req, res) => {
    try {
        const { property, unit, leaseStart, leaseEnd } = req.body;

        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            {
                property,
                unit,
                leaseStart,
                leaseEnd,
                isActive: true
            },
            { new: true }
        );

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        res.status(200).json({
            message: "Tenant assigned successfully",
            tenant
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// End tenant lease
exports.endLease = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false,
                leaseEnd: Date.now()
            },
            { new: true }
        );

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        res.status(200).json({
            message: "Lease ended successfully",
            tenant
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tenants under a specific property
exports.getTenantsByProperty = async (req, res) => {
    try {
        const tenants = await Tenant.find({ property: req.params.propertyId })
            .populate("property")
            .populate("unit");

        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
