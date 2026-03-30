const Job = require('../models/Job');
const Firm = require('../models/Firm');
const Application = require('../models/Application');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

exports.createJob = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        if (!firm) return res.status(404).json({ success: false, message: 'Firm profile not found' });

        // Subscription gate: firm must have an active subscription to post jobs
        if (!firm.subscription || firm.subscription.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'An active subscription is required to post jobs. Please purchase a plan from Billing.',
                code: 'SUBSCRIPTION_REQUIRED'
            });
        }

        // Check expiry date
        if (firm.subscription.expiryDate && new Date(firm.subscription.expiryDate) < new Date()) {
            return res.status(403).json({
                success: false,
                message: 'Your subscription has expired. Please renew your plan to post jobs.',
                code: 'SUBSCRIPTION_EXPIRED'
            });
        }

        const job = await Job.create({ ...req.body, firmId: firm._id });
        firm.activeJobs += 1;
        await firm.save();

        // Notify active students about the new job
        const students = await Student.find({}, 'userId');
        const notifications = students.map(student => ({
            userId: student.userId,
            type: 'new_job',
            title: 'New Job Posted!',
            message: `A new job "${job.title}" has been posted at ${firm.firmName}.`,
            link: `/jobs/${job._id}`
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, data: job, message: 'Job posted successfully' });
    } catch (error) { next(error); }
};

exports.getAllJobs = async (req, res, next) => {
    try {
        const { location, type, salaryMin, salaryMax, status = 'active', page = 1, limit = 10, sort = '-postedDate', search } = req.query;
        const query = { status };
        if (location) query.location = new RegExp(location, 'i');
        if (type) query.articleshipType = type;
        if (salaryMin) query.salaryMax = { $gte: parseInt(salaryMin) };
        if (salaryMax) query.salaryMin = { $lte: parseInt(salaryMax) };
        if (search) query.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];

        const jobs = await Job.find(query).populate({ path: 'firmId', select: 'firmName logo address rating reviewCount', populate: { path: 'userId', select: 'name' } })
            .skip((page - 1) * limit).limit(parseInt(limit)).sort(sort);
        const total = await Job.countDocuments(query);

        res.json({ success: true, data: { jobs, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) { next(error); }
};

exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate({ path: 'firmId', select: 'firmName logo address rating reviewCount website description teamSize', populate: { path: 'userId', select: 'name email' } });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        job.viewsCount += 1;
        await job.save();
        res.json({ success: true, data: job });
    } catch (error) { next(error); }
};

exports.updateJob = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        const job = await Job.findOne({ _id: req.params.id, firmId: firm._id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found or not authorized' });

        Object.assign(job, req.body);
        await job.save();
        res.json({ success: true, data: job, message: 'Job updated' });
    } catch (error) { next(error); }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        const job = await Job.findOneAndDelete({ _id: req.params.id, firmId: firm._id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        
        firm.activeJobs = Math.max(0, firm.activeJobs - 1);
        await firm.save();

        // Cleanup orphaned data
        await Application.deleteMany({ jobId: job._id });
        await Notification.deleteMany({ link: { $regex: job._id } });

        res.json({ success: true, message: 'Job deleted' });
    } catch (error) { next(error); }
};

exports.closeJob = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        const job = await Job.findOne({ _id: req.params.id, firmId: firm._id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        job.status = 'closed';
        await job.save();
        firm.activeJobs = Math.max(0, firm.activeJobs - 1);
        await firm.save();
        res.json({ success: true, data: job, message: 'Job closed' });
    } catch (error) { next(error); }
};

exports.getJobApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ jobId: req.params.id })
            .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email avatar' } });
        res.json({ success: true, data: applications });
    } catch (error) { next(error); }
};

exports.getMyJobs = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        if (!firm) return res.status(404).json({ success: false, message: 'Firm not found' });
        const jobs = await Job.find({ firmId: firm._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: jobs });
    } catch (error) { next(error); }
};
