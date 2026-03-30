const router = require('express').Router();
const { getPlans, getMySubscription, subscribe, cancelSubscription } = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/plans', getPlans);
router.get('/me', protect, authorize('firm'), getMySubscription);
router.post('/', protect, authorize('firm'), subscribe);
router.delete('/cancel', protect, authorize('firm'), cancelSubscription);

module.exports = router;
