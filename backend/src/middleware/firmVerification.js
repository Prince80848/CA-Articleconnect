const Firm = require('../models/Firm');

const requireFirmVerification = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'firm') {
            return res.status(403).json({ success: false, message: 'Access denied. You must be a firm to perform this action.' });
        }

        const firm = await Firm.findOne({ userId: req.user._id });
        
        if (!firm) {
            return res.status(404).json({ success: false, message: 'Firm profile not found.' });
        }

        if (!firm.isVerified) {
            return res.status(403).json({ 
                success: false, 
                message: 'Your firm account is pending admin approval. You cannot perform this action yet.' 
            });
        }

        // Check if firm has an active (non-expired) subscription
        if (!firm.subscription || firm.subscription.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Your subscription is inactive or expired. Please purchase a plan to continue.',
                subscriptionRequired: true
            });
        }

        next();
    } catch (error) {
        console.error('Firm verification middleware error:', error);
        res.status(500).json({ success: false, message: 'Server Error in verifying firm status.' });
    }
};

module.exports = { requireFirmVerification };
