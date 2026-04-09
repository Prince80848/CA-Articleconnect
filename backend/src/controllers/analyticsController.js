const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Firm = require('../models/Firm');
const Student = require('../models/Student');

exports.getDashboard = async (req, res, next) => {
    try {
        if (req.user.role === 'firm') {
            const firm = await Firm.findOne({ userId: req.user._id });
            const [totalJobs, activeJobs, totalApps, hiredCount, recentApps] = await Promise.all([
                Job.countDocuments({ firmId: firm._id }),
                Job.countDocuments({ firmId: firm._id, status: 'active' }),
                Application.countDocuments({ firmId: firm._id }),
                Application.countDocuments({ firmId: firm._id, status: 'hired' }),
                Application.find({ firmId: firm._id }).populate({ path: 'studentId', populate: { path: 'userId', select: 'name avatar' } }).populate('jobId', 'title').sort({ createdAt: -1 }).limit(5)
            ]);
            return res.json({ success: true, data: { totalJobs, activeJobs, totalApplications: totalApps, hiredCount, recentApplications: recentApps } });
        }

        if (req.user.role === 'student') {
            const student = await Student.findOne({ userId: req.user._id });
            const [totalApps, interviewCount, offerCount, recentApps] = await Promise.all([
                Application.countDocuments({ studentId: student._id }),
                Application.countDocuments({ studentId: student._id, status: 'interviewed' }),
                Application.countDocuments({ studentId: student._id, status: 'offered' }),
                Application.find({ studentId: student._id }).populate({ path: 'jobId', populate: { path: 'firmId', select: 'firmName logo' } }).sort({ createdAt: -1 }).limit(5)
            ]);
            return res.json({ success: true, data: { totalApplications: totalApps, interviewCount, offerCount, profileViews: student.profileViews, recentApplications: recentApps } });
        }

        // Admin
        const [totalUsers, totalJobs, totalApps, revenue] = await Promise.all([
            User.countDocuments(), Job.countDocuments(), Application.countDocuments(),
            Payment.aggregate([{ $match: { status: 'successful' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
        ]);
        res.json({ success: true, data: { totalUsers, totalJobs, totalApplications: totalApps, totalRevenue: revenue[0]?.total || 0 } });
    } catch (error) { next(error); }
};

exports.getJobAnalytics = async (req, res, next) => {
    try {
        const analytics = await Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 }, avgViews: { $avg: '$viewsCount' }, avgApps: { $avg: '$applicationsCount' } } }
        ]);
        const locationStats = await Job.aggregate([
            { $match: { status: 'active' } }, { $group: { _id: '$location', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }
        ]);
        res.json({ success: true, data: { statusBreakdown: analytics, locationStats } });
    } catch (error) { next(error); }
};

exports.getApplicationAnalytics = async (req, res, next) => {
    try {
        const statusBreakdown = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const monthlyApps = await Application.aggregate([
            { $group: { _id: { $month: '$appliedDate' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }
        ]);
        res.json({ success: true, data: { statusBreakdown, monthlyApplications: monthlyApps } });
    } catch (error) { next(error); }
};

exports.getRevenueAnalytics = async (req, res, next) => {
    try {
        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'successful' } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { '_id.year': -1, '_id.month': -1 } }, { $limit: 12 }
        ]);
        const typeBreakdown = await Payment.aggregate([
            { $match: { status: 'successful' } },
            { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);
        res.json({ success: true, data: { monthlyRevenue, typeBreakdown } });
    } catch (error) { next(error); }
};

exports.getPlatformAnalytics = async (req, res, next) => {
    try {
        const [
            totalJobs, activeJobs, totalApplications,
            shortlisted, interviewed, hired,
            jobSalaryStats, locationStats,
            allPayments
        ] = await Promise.all([
            Job.countDocuments(),
            Job.countDocuments({ status: 'active' }),
            Application.countDocuments(),
            Application.countDocuments({ status: 'shortlisted' }),
            Application.countDocuments({ status: 'interviewed' }),
            Application.countDocuments({ status: 'hired' }),
            Job.aggregate([{ $group: { _id: null, avgSalary: { $avg: { $avg: ['$salaryMin', '$salaryMax'] } }, avgApplications: { $avg: '$applicationsCount' } } }]),
            Job.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: '$location', count: { $sum: 1 } } },
                { $sort: { count: -1 } }, { $limit: 6 }
            ]),
            Payment.aggregate([
                { $match: { status: 'successful' } },
                { $group: { _id: '$type', total: { $sum: '$amount' } } }
            ])
        ]);

        const revenueByType = {};
        allPayments.forEach(p => { revenueByType[p._id] = p.total; });

        // Payment types: 'subscription' = firm subscriptions, 'student_subscription' & 'premium' = student premiums
        const firmSubscriptions = (revenueByType['subscription'] || 0) + (revenueByType['firm_subscription'] || 0);
        const studentPremiums = (revenueByType['student_subscription'] || 0) + (revenueByType['premium'] || 0);
        const totalRevenue = Object.values(revenueByType).reduce((a, b) => a + b, 0);

        res.json({
            success: true,
            data: {
                jobStats: {
                    total: totalJobs,
                    active: activeJobs,
                    avgApplications: jobSalaryStats[0]?.avgApplications || 0,
                    avgSalary: jobSalaryStats[0]?.avgSalary || 0
                },
                applicationStats: {
                    total: totalApplications,
                    shortlisted,
                    interviewed,
                    hired
                },
                revenue: {
                    firmSubscriptions,
                    studentPremiums,
                    total: totalRevenue
                },
                topLocations: locationStats.map(l => ({ location: l._id, count: l.count }))
            }
        });
    } catch (error) { next(error); }
};

