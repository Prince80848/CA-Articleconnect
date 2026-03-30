const Student = require('../models/Student');

exports.getMyProfile = async (req, res, next) => {
    try {
        const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'name email phone avatar');
        if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
        res.json({ success: true, data: student });
    } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updates = {};
        const fields = ['icaiRegistration', 'college', 'graduationYear', 'currentStatus', 'resume', 'skills', 'preferredLocations', 'availabilityDate', 'profile', 'experience', 'education'];
        fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
        const student = await Student.findOneAndUpdate({ userId: req.user._id }, updates, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
        res.json({ success: true, data: student, message: 'Profile updated' });
    } catch (error) { next(error); }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const { status, location, page = 1, limit = 10, search, skills } = req.query;
        const query = {};
        if (status) query.currentStatus = status;
        if (location) query.preferredLocations = { $in: [new RegExp(location, 'i')] };
        if (skills) query.skills = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };

        const students = await Student.find(query).populate('userId', 'name email avatar')
            .skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Student.countDocuments(query);

        res.json({ success: true, data: { students, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) { next(error); }
};

exports.getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('userId', 'name email avatar');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        student.profileViews += 1;
        await student.save();
        res.json({ success: true, data: student });
    } catch (error) { next(error); }
};
const Payment = require('../models/Payment');

const STUDENT_PLANS = {
    premium: { name: 'Premium', price: 299 },
    pro: { name: 'Pro', price: 599 }
};

exports.upgradeToPremium = async (req, res, next) => {
    try {
        const { plan } = req.body;
        if (!STUDENT_PLANS[plan]) {
            return res.status(400).json({ success: false, message: 'Invalid plan selected' });
        }

        const student = await Student.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const startDate = new Date();
        const expiryDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Create a payment record for revenue tracking
        const payment = await Payment.create({
            userId: req.user._id,
            type: 'student_subscription',
            amount: STUDENT_PLANS[plan].price,
            razorpayOrderId: 'order_stu_' + Date.now() + Math.random().toString(36).substr(2, 9),
            razorpayPaymentId: 'pay_stu_' + Date.now(),
            razorpaySignature: 'sig_simulated',
            description: `Student ${STUDENT_PLANS[plan].name} Plan – 30 days`,
            status: 'successful',
            paymentDate: new Date(),
            invoiceNumber: 'INV-STU-' + Date.now()
        });

        student.premium = {
            active: true,
            plan: plan,
            startDate,
            expiryDate
        };

        student.markModified('premium');
        await student.save();

        res.status(200).json({ 
            success: true, 
            message: `Successfully upgraded to ${STUDENT_PLANS[plan].name} plan!`,
            data: { premium: student.premium, payment }
        });
    } catch (error) { next(error); }
};

exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No resume file uploaded' });
        }
        
        // Use a relative URL path so it works through any proxy or domain
        const resumeUrl = `/uploads/${req.file.filename}`;
        
        // Optionally update the student profile with the latest resume URL
        await Student.findOneAndUpdate({ userId: req.user._id }, { resume: resumeUrl });

        res.json({ 
            success: true, 
            data: { resumeUrl },
            message: 'Resume uploaded successfully' 
        });
    } catch (error) { next(error); }
};
