const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    unitNumber: { type: String, required: true },
    floor: { type: Number },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rentAmount: { type: Number, required: true },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    isOccupied: {
        type: Boolean,
        default: false
    },

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        default: null
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Unit", unitSchema);
