const router = require('express').Router();
const { getAllUsers, updateUserStatus, deleteUser, getPendingFirms, approveFirm, rejectFirm, getAdminStats, getRecentPayments, getAllSubscriptions, adminPostJob } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/firms/pending', getPendingFirms);
router.put('/firms/:id/approve', approveFirm);
router.put('/firms/:id/reject', rejectFirm);
router.get('/payments/recent', getRecentPayments);
router.get('/subscriptions', getAllSubscriptions);
router.post('/jobs', adminPostJob);

module.exports = router;
