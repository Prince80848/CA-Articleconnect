const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    icaiRegistration: { type: String, trim: true },
    icaiVerified: { type: Boolean, default: false },
    college: { type: String, trim: true },
    graduationYear: Number,
    currentStatus: { type: String, enum: ['looking', 'in-discussions', 'hired'], default: 'looking' },
    resume: { type: String, default: '' },
    skills: [String],
    preferredLocations: [String],
    availabilityDate: Date,
    premium: {
        active: { type: Boolean, default: false },
        plan: { type: String, enum: ['premium', 'pro'] },
        startDate: Date,
        expiryDate: Date
    },
    profile: {
        bio: { type: String, maxlength: 1000 },
        cgpa: { type: Number, min: 0, max: 10 },
        isCAFinal: { type: Boolean, default: false },
        isCAInter: { type: Boolean, default: false },
        attempts: Number
    },
    experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        institution: String,
        year: Number,
        grade: String
    }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 }
}, { timestamps: true });

studentSchema.index({ currentStatus: 1 });
studentSchema.index({ preferredLocations: 1 });
studentSchema.index({ 'premium.active': 1 });

module.exports = mongoose.model('Student', studentSchema);
