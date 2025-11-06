//tenantController
const Tenant = require('../models/Tenants.js');

//Create a new tenant
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
        const tenants = await Tenant.find().populate('property unit');
        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id).populate('property unit');
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update a tenant by ID
exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tenant) 
            return res.status(404).json({ message: 'Tenant not found' });  
        res.status(200).json(tenant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Delete a tenant by ID 
exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndDelete(req.params.id);   
        if (!tenant) 
            return res.status(404).json({ message: 'Tenant not found' });
        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

