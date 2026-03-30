const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
    plan: { type: String, enum: ['startup', 'growth', 'enterprise'], required: true },
    status: { type: String, enum: ['active', 'inactive', 'expired', 'cancelled'], default: 'active' },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    features: {
        maxJobPostings: Number,
        maxStudentAccess: Number,
        prioritySupport: Boolean,
        analyticsAccess: Boolean,
        apiAccess: Boolean
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
}, { timestamps: true });

subscriptionSchema.index({ firmId: 1 });
subscriptionSchema.index({ status: 1, expiryDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
