const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    unit:{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    leaseStart: { type: Date },
    leaseEnd: { type: Date },
    rentAmount: { type: Number },
    status: { type: String, enum:['active', 'inactive'], default: 'active '},
}, {timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema );