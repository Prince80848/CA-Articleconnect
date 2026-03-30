const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firmName: { type: String, required: [true, 'Firm name is required'], trim: true },
    registrationNumber: { type: String, trim: true },
    logo: { type: String, default: '' },
    website: { type: String, trim: true },
    description: { type: String, maxlength: 2000 },
    address: {
        street: String,
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: 'India' },
        pincode: String
    },
    teamSize: { type: Number, default: 0 },
    yearsInBusiness: { type: Number, default: 0 },
    specializations: [String],
    subscription: {
        plan: { type: String, enum: ['free', 'startup', 'growth', 'enterprise'], default: 'free' },
        status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'inactive' },
        startDate: Date,
        expiryDate: Date,
        autoRenew: { type: Boolean, default: false }
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    activeJobs: { type: Number, default: 0 },
    totalHires: { type: Number, default: 0 },
    contactEmail: String,
    contactPhone: String
}, { timestamps: true });

firmSchema.index({ 'address.city': 1 });
firmSchema.index({ isVerified: 1 });
firmSchema.index({ 'subscription.plan': 1 });

module.exports = mongoose.model('Firm', firmSchema);
