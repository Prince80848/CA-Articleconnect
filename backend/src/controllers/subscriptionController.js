const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Firm = require('../models/Firm');

const PLANS = {
    startup: { name: 'Startup', price: 5000, maxJobPostings: 5, maxStudentAccess: 50, prioritySupport: false, analyticsAccess: false, apiAccess: false },
    growth: { name: 'Growth', price: 15000, maxJobPostings: -1, maxStudentAccess: 500, prioritySupport: true, analyticsAccess: true, apiAccess: false },
    enterprise: { name: 'Enterprise', price: 50000, maxJobPostings: -1, maxStudentAccess: -1, prioritySupport: true, analyticsAccess: true, apiAccess: true }
};

exports.getPlans = async (req, res) => {
    res.json({ success: true, data: Object.entries(PLANS).map(([key, val]) => ({ id: key, ...val })) });
};

exports.getMySubscription = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        if (!firm) return res.json({ success: true, data: null });
        const subscription = await Subscription.findOne({ firmId: firm._id, status: 'active' });
        res.json({ success: true, data: subscription });
    } catch (error) { next(error); }
};

exports.subscribe = async (req, res, next) => {
    try {
        const { plan, paymentId } = req.body;
        if (!PLANS[plan]) return res.status(400).json({ success: false, message: 'Invalid plan' });

        const firm = await Firm.findOne({ userId: req.user._id });
        if (!firm) return res.status(404).json({ success: false, message: 'Firm not found' });

        // Deactivate existing subscriptions
        await Subscription.updateMany({ firmId: firm._id, status: 'active' }, { status: 'expired' });

        const startDate = new Date();
        const expiryDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Create or update a payment record linked to this subscription
        let payment;
        if (paymentId) {
            // If paymentId was passed (from the payment flow), link it
            payment = await Payment.findById(paymentId);
        }

        if (!payment) {
            // Create a new payment record if none provided (direct subscribe)
            payment = await Payment.create({
                userId: req.user._id,
                firmId: firm._id,
                type: 'subscription',
                amount: PLANS[plan].price,
                razorpayOrderId: 'order_' + Date.now() + Math.random().toString(36).substr(2, 9),
                razorpayPaymentId: 'pay_' + Date.now(),
                razorpaySignature: 'sig_simulated',
                description: `${PLANS[plan].name} Plan Subscription`,
                status: 'successful',
                paymentDate: new Date(),
                invoiceNumber: 'INV-' + Date.now()
            });
        }

        const subscription = await Subscription.create({
            firmId: firm._id,
            plan,
            price: PLANS[plan].price,
            startDate,
            expiryDate,
            paymentId: payment._id,
            features: {
                maxJobPostings: PLANS[plan].maxJobPostings,
                maxStudentAccess: PLANS[plan].maxStudentAccess,
                prioritySupport: PLANS[plan].prioritySupport,
                analyticsAccess: PLANS[plan].analyticsAccess,
                apiAccess: PLANS[plan].apiAccess
            }
        });

        firm.subscription = { plan, status: 'active', startDate, expiryDate, autoRenew: true };
        await firm.save();

        res.status(201).json({ success: true, data: { subscription, payment }, message: `Successfully subscribed to ${PLANS[plan].name} plan!` });
    } catch (error) { next(error); }
};

exports.cancelSubscription = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id });
        const subscription = await Subscription.findOne({ firmId: firm._id, status: 'active' });
        if (!subscription) return res.status(404).json({ success: false, message: 'No active subscription' });

        subscription.status = 'cancelled';
        await subscription.save();
        firm.subscription.status = 'inactive';
        await firm.save();

        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) { next(error); }
};
