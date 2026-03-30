const router = require('express').Router();
const { getDashboard, getJobAnalytics, getApplicationAnalytics, getRevenueAnalytics, getPlatformAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.get('/jobs', protect, getJobAnalytics);
router.get('/applications', protect, getApplicationAnalytics);
router.get('/revenue', protect, getRevenueAnalytics);
router.get('/platform', protect, getPlatformAnalytics);

module.exports = router;
