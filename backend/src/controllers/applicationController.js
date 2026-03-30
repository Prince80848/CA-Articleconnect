const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Firm = require('../models/Firm');
const Notification = require('../models/Notification');

exports.applyToJob = async (req, res, next) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

        // Enforce 5 free applications limit
        const FREE_APPLICATION_LIMIT = 5;
        const isPremium = student.premium?.active && student.premium?.expiryDate > new Date();
        if (!isPremium && student.totalApplications >= FREE_APPLICATION_LIMIT) {
            return res.status(403).json({
                success: false,
                message: `You have used all ${FREE_APPLICATION_LIMIT} free applications. Please upgrade to Premium or Pro to apply to more jobs.`,
                upgradeRequired: true
            });
        }

        const job = await Job.findById(req.body.jobId);
        if (!job || job.status !== 'active') return res.status(400).json({ success: false, message: 'Job is not active' });

        const existing = await Application.findOne({ studentId: student._id, jobId: job._id });
        if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

        // Resume is mandatory
        if (!req.body.resumeUrl) return res.status(400).json({ success: false, message: 'Resume upload is required to apply' });

        const application = await Application.create({
            studentId: student._id, jobId: job._id, firmId: job.firmId,
            coverLetter: req.body.coverLetter,
            resumeUrl: req.body.resumeUrl,
            applicantName: req.body.applicantName,
            applicantEmail: req.body.applicantEmail,
            applicantPhone: req.body.applicantPhone,
            statusHistory: [{ status: 'applied', date: new Date() }]
        });

        job.applicationsCount += 1;
        await job.save();
        student.totalApplications += 1;
        await student.save();

        // Notify firm
        const firm = await Firm.findById(job.firmId);
        if (firm) {
            await Notification.create({ userId: firm.userId, type: 'application_update', title: 'New Application', message: `New application received for "${job.title}"`, link: `/firm/candidates` });
        }

        res.status(201).json({ success: true, data: application, message: 'Application submitted' });
    } catch (error) { next(error); }
};

exports.getMyApplications = async (req, res, next) => {
    try {
        let applications;
        if (req.user.role === 'student') {
            const student = await Student.findOne({ userId: req.user._id });
            applications = await Application.find({ studentId: student._id })
                .populate({ path: 'jobId', select: 'title location salaryMin salaryMax articleshipType status', populate: { path: 'firmId', select: 'firmName logo' } })
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'firm') {
            const firm = await Firm.findOne({ userId: req.user._id });
            applications = await Application.find({ firmId: firm._id })
                .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email avatar' } })
                .populate('jobId', 'title location')
                .sort({ createdAt: -1 });
        }
        res.json({ success: true, data: applications });
    } catch (error) { next(error); }
};

exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email avatar phone' } })
            .populate({ path: 'jobId', populate: { path: 'firmId', select: 'firmName logo' } });
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, data: application });
    } catch (error) { next(error); }
};

exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status, notes, interviewDate, interviewNotes } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        application.status = status;
        if (notes) application.notes = notes;
        if (interviewDate) application.interviewDate = interviewDate;
        if (interviewNotes) application.interviewNotes = interviewNotes;
        application.statusHistory.push({ status, date: new Date(), note: notes });
        await application.save();

        // Notify student
        const student = await Student.findById(application.studentId);
        if (student) {
            await Notification.create({ userId: student.userId, type: 'application_update', title: 'Application Update', message: `Your application status changed to "${status}"`, link: '/student/applications' });
        }

        res.json({ success: true, data: application, message: 'Status updated' });
    } catch (error) { next(error); }
};

exports.withdrawApplication = async (req, res, next) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        const application = await Application.findOne({ _id: req.params.id, studentId: student._id });
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        application.status = 'withdrawn';
        application.statusHistory.push({ status: 'withdrawn', date: new Date() });
        await application.save();

        res.json({ success: true, message: 'Application withdrawn' });
    } catch (error) { next(error); }
};

exports.scheduleInterview = async (req, res, next) => {
    try {
        const { interviewDate, notes } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        application.status = 'interviewed';
        application.interviewDate = interviewDate;
        application.interviewNotes = notes;
        application.statusHistory.push({ status: 'interviewed', date: new Date(), note: `Interview scheduled for ${interviewDate}` });
        await application.save();

        const student = await Student.findById(application.studentId);
        if (student) {
            await Notification.create({ userId: student.userId, type: 'interview', title: 'Interview Scheduled', message: `Interview scheduled for ${new Date(interviewDate).toLocaleDateString()}`, link: '/student/applications' });
        }

        res.json({ success: true, data: application, message: 'Interview scheduled' });
    } catch (error) { next(error); }
};

exports.sendOffer = async (req, res, next) => {
    try {
        const { salary, joiningDate, terms } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        application.status = 'offered';
        application.offerDate = new Date();
        application.offerDetails = { salary, joiningDate, terms };
        application.statusHistory.push({ status: 'offered', date: new Date(), note: `Offer sent: ₹${salary}` });
        await application.save();

        const student = await Student.findById(application.studentId);
        if (student) {
            await Notification.create({ userId: student.userId, type: 'offer', title: 'Job Offer!', message: `You received offer for ₹${salary}!`, link: '/student/applications' });
        }

        res.json({ success: true, data: application, message: 'Offer sent' });
    } catch (error) { next(error); }
};
