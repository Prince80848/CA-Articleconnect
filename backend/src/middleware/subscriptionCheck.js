const Student = require('../models/Student');
const Firm = require('../models/Firm');
const Subscription = require('../models/Subscription');

/**
 * Middleware that auto-expires subscriptions when their expiry date has passed.
 * Runs on every authenticated request to ensure benefits stop immediately when expired.
 */
const checkSubscriptionExpiry = async (req, res, next) => {
    try {
        if (!req.user) return next();

        if (req.user.role === 'student') {
            const student = await Student.findOne({ userId: req.user._id });
            if (student && student.premium?.active && student.premium?.expiryDate) {
                if (new Date(student.premium.expiryDate) < new Date()) {
                    student.premium.active = false;
                    student.markModified('premium');
                    await student.save();
                }
            }
        } else if (req.user.role === 'firm') {
            const firm = await Firm.findOne({ userId: req.user._id });
            if (firm && firm.subscription?.status === 'active' && firm.subscription?.expiryDate) {
                if (new Date(firm.subscription.expiryDate) < new Date()) {
                    firm.subscription.status = 'expired';
                    firm.markModified('subscription');
                    await firm.save();

                    // Also expire the Subscription document
                    await Subscription.updateMany(
                        { firmId: firm._id, status: 'active' },
                        { status: 'expired' }
                    );
                }
            }
        }

        next();
    } catch (error) {
        console.error('Subscription expiry check error:', error);
        next(); // Don't block the request on error
    }
};

module.exports = { checkSubscriptionExpiry };
