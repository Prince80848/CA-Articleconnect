const User = require('../models/User');
const Firm = require('../models/Firm');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');

exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 20, status } = req.query;
        const query = {};
        if (role) query.role = role;
        if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;

        const users = await User.find(query).select('-refreshToken').skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);
        res.json({ success: true, data: { users, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) { next(error); }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const { isActive, emailVerified } = req.body;
        const updates = {};
        if (isActive !== undefined) updates.isActive = isActive;
        if (emailVerified !== undefined) updates.emailVerified = emailVerified;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user, message: 'User updated' });
    } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'User deactivated' });
    } catch (error) { next(error); }
};

exports.getPendingFirms = async (req, res, next) => {
    try {
        const firms = await Firm.find({ isVerified: false }).populate('userId', 'name email phone createdAt');
        res.json({ success: true, data: firms });
    } catch (error) { next(error); }
};

exports.approveFirm = async (req, res, next) => {
    try {
        const firm = await Firm.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!firm) return res.status(404).json({ success: false, message: 'Firm not found' });

        await Notification.create({ userId: firm.userId, type: 'approval', title: 'Firm Approved!', message: 'Your firm has been verified and approved.', link: '/firm/dashboard' });
        res.json({ success: true, data: firm, message: 'Firm approved' });
    } catch (error) { next(error); }
};

exports.rejectFirm = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const firm = await Firm.findById(req.params.id);
        if (!firm) return res.status(404).json({ success: false, message: 'Firm not found' });

        await Notification.create({ userId: firm.userId, type: 'approval', title: 'Firm Verification Rejected', message: reason || 'Your firm verification was not approved.', link: '/firm/profile' });
        res.json({ success: true, message: 'Firm rejected' });
    } catch (error) { next(error); }
};

exports.getAdminStats = async (req, res, next) => {
    try {
        const [totalUsers, totalFirms, totalStudents, totalJobs, totalApplications, totalPayments, firmRevenue, studentRevenue, pendingFirms, activeSubscriptions, premiumStudents] = await Promise.all([
            User.countDocuments(), Firm.countDocuments(), Student.countDocuments(),
            Job.countDocuments(), Application.countDocuments(),
            Payment.aggregate([{ $match: { status: 'successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Payment.aggregate([{ $match: { status: 'successful', type: 'subscription' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Payment.aggregate([{ $match: { status: 'successful', type: 'student_subscription' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Firm.countDocuments({ isVerified: false }),
            Subscription.countDocuments({ status: 'active' }),
            Student.countDocuments({ 'premium.active': true })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers, totalFirms, totalStudents, totalJobs, totalApplications,
                totalRevenue: totalPayments[0]?.total || 0,
                firmRevenue: firmRevenue[0]?.total || 0,
                studentRevenue: studentRevenue[0]?.total || 0,
                pendingFirms,
                activeJobs: await Job.countDocuments({ status: 'active' }),
                hiredCount: await Application.countDocuments({ status: 'hired' }),
                activeSubscriptions,
                premiumStudents
            }
        });
    } catch (error) { next(error); }
};

exports.getRecentPayments = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, status } = req.query;
        const query = {};
        if (status) query.status = status;

        const payments = await Payment.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('userId', 'name email')
            .populate('firmId', 'firmName');

        const total = await Payment.countDocuments(query);
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'successful' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            data: {
                payments,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) { next(error); }
};

exports.getAllSubscriptions = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};
        if (status) query.status = status;

        const subscriptions = await Subscription.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('firmId', 'firmName userId')
            .populate({ path: 'firmId', populate: { path: 'userId', select: 'name email' } });

        const total = await Subscription.countDocuments(query);
        res.json({ success: true, data: { subscriptions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
    } catch (error) { next(error); }
};

// Admin can post jobs directly without subscription
exports.adminPostJob = async (req, res, next) => {
    try {
        const postedFirmName = req.body.firmName || 'Platform Admin';

        // First try to find an existing firm owned by this admin user
        let firm = await Firm.findOne({ userId: req.user._id });

        if (!firm) {
            // Create a platform firm tied to the admin user
            firm = await Firm.create({
                userId: req.user._id,
                firmName: postedFirmName,
                isVerified: true,
                subscription: { status: 'active', plan: 'enterprise', expiryDate: new Date('2099-01-01') }
            });
        } else if (req.body.firmName && firm.firmName !== req.body.firmName) {
            // If admin specified a different name, update it for this post
            firm.firmName = req.body.firmName;
            await firm.save();
        }

        // Remove firmName from body so it doesn't pollute Job fields
        const { firmName, ...jobData } = req.body;

        const job = await Job.create({
            ...jobData,
            firmId: firm._id,
            status: 'active',
            isExternal: req.body.isExternal || false,
            externalLink: req.body.externalLink || ''
        });

        // Notify all students
        const students = await Student.find({}, 'userId');
        const notifications = students.map(s => ({
            userId: s.userId,
            type: 'new_job',
            title: 'New Job Posted!',
            message: `A new job "${job.title}" has been posted at ${firm.firmName}.`,
            link: `/jobs/${job._id}`
        }));
        if (notifications.length > 0) await Notification.insertMany(notifications);

        res.status(201).json({ success: true, data: job, message: 'Job posted by admin' });
    } catch (error) { next(error); }
};

