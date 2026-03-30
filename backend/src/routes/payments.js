const router = require('express').Router();
const { createPayment, verifyPayment, getPaymentHistory, getPaymentById, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/key', protect, getRazorpayKey);
router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/:id', protect, getPaymentById);

module.exports = router;
