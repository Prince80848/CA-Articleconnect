const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
    type: { type: String, enum: ['subscription', 'student_subscription', 'commission', 'premium', 'refund'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ['pending', 'successful', 'failed', 'refunded'], default: 'pending' },
    invoiceNumber: String,
    description: String,
    paymentDate: Date,
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

paymentSchema.index({ userId: 1 });
paymentSchema.index({ firmId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
