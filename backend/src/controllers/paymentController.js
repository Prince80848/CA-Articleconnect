const Payment = require('../models/Payment');
const Firm = require('../models/Firm');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Lazy Razorpay instance - created on first use
let razorpayInstance = null;

function getRazorpayInstance() {
    if (!razorpayInstance) {
        const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
        const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

        if (!keyId || !keySecret) {
            console.error('RAZORPAY ERROR: Missing env variables. Found RAZORPAY_KEY_ID:', keyId ? 'SET' : 'MISSING', 'RAZORPAY_KEY_SECRET:', keySecret ? 'SET' : 'MISSING');
            console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('RAZOR') || k.includes('razor')));
            throw new Error('Razorpay credentials not configured. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
        }

        razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return razorpayInstance;
}

exports.createPayment = async (req, res, next) => {
    try {
        const { amount, type, description } = req.body;
        const firm = req.user.role === 'firm' ? await Firm.findOne({ userId: req.user._id }) : null;

        const razorpay = getRazorpayInstance();

        // Create real Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: 'rcpt_' + Date.now(),
            notes: {
                userId: req.user._id.toString(),
                type: type || 'subscription',
                description: description || ''
            }
        };

        console.log('Creating Razorpay order with options:', { amount: options.amount, currency: options.currency });
        const razorpayOrder = await razorpay.orders.create(options);
        console.log('Razorpay order created:', razorpayOrder.id);

        const payment = await Payment.create({
            userId: req.user._id,
            firmId: firm?._id,
            type: type || 'subscription',
            amount,
            razorpayOrderId: razorpayOrder.id,
            description,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: {
                payment,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: (process.env.RAZORPAY_KEY_ID || '').trim()
            },
            message: 'Payment order created'
        });
    } catch (error) {
        console.error('PAYMENT CREATE ERROR:', error.message);
        console.error('Full error:', error);
        // Return a clear error to the frontend instead of passing to generic handler
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create payment order'
        });
    }
};

exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ success: false, message: 'Missing payment verification data' });
        }

        // Verify signature using HMAC SHA256
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', (process.env.RAZORPAY_KEY_SECRET || '').trim())
            .update(body)
            .digest('hex');

        const isValid = expectedSignature === razorpaySignature;

        const payment = await Payment.findOne({ razorpayOrderId });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

        if (isValid) {
            payment.razorpayPaymentId = razorpayPaymentId;
            payment.razorpaySignature = razorpaySignature;
            payment.status = 'successful';
            payment.paymentDate = new Date();
            payment.invoiceNumber = 'INV-' + Date.now();
            await payment.save();

            res.json({ success: true, data: payment, message: 'Payment verified successfully' });
        } else {
            payment.status = 'failed';
            await payment.save();
            res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        next(error);
    }
};

exports.getPaymentHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let query = { userId: req.user._id };
        if (req.user.role === 'admin') query = {};

        const payments = await Payment.find(query).sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Payment.countDocuments(query);

        res.json({ success: true, data: { payments, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) { next(error); }
};

exports.getPaymentById = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) { next(error); }
};

// Endpoint to provide Razorpay key to frontend
exports.getRazorpayKey = async (req, res) => {
    res.json({ success: true, data: { keyId: (process.env.RAZORPAY_KEY_ID || '').trim() } });
};
