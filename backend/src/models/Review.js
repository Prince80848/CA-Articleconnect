const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['firm', 'student'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    tags: [String],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ targetId: 1, targetType: 1 });
reviewSchema.index({ reviewerId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
