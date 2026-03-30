const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn'],
        default: 'applied'
    },
    appliedDate: { type: Date, default: Date.now },
    coverLetter: { type: String, maxlength: 2000 },
    resumeUrl: { type: String },
    applicantName: { type: String },
    applicantEmail: { type: String },
    applicantPhone: { type: String },
    interviewDate: Date,
    interviewNotes: String,
    interviewResult: String,
    offerDate: Date,
    offerDetails: {
        salary: Number,
        joiningDate: Date,
        terms: String
    },
    joiningDate: Date,
    notes: String,
    statusHistory: [{
        status: String,
        date: { type: Date, default: Date.now },
        note: String
    }]
}, { timestamps: true });

applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ firmId: 1, status: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
