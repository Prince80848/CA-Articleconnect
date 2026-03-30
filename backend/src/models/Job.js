const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
    title: { type: String, required: [true, 'Job title is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Job description is required'], maxlength: 5000 },
    location: { type: String, required: true, trim: true },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    duration: { type: Number, default: 36 },
    articleshipType: { type: String, enum: ['full-time', 'hybrid', 'remote'], default: 'full-time' },
    requirements: [String],
    skills: [String],
    interviewProcess: [String],
    benefits: [String],
    status: { type: String, enum: ['active', 'closed', 'filled', 'draft'], default: 'active' },
    applicationsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    postedDate: { type: Date, default: Date.now },
    expiryDate: Date,
    isFeatured: { type: Boolean, default: false },
    isExternal: { type: Boolean, default: false },
    externalLink: { type: String, trim: true }
}, { timestamps: true });

jobSchema.index({ status: 1, postedDate: -1 });
jobSchema.index({ location: 1 });
jobSchema.index({ firmId: 1 });
jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
