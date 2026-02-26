const mongoose = require('mongoose');

const ServiceOfferingSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting', 'gardening', 'moving', 'other',],
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
        },
        features: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ServiceOffering', ServiceOfferingSchema);
            