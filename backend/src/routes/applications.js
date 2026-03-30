const router = require('express').Router();
const { applyToJob, getMyApplications, getApplicationById, updateApplicationStatus, withdrawApplication, scheduleInterview, sendOffer } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), applyToJob);
router.get('/', protect, getMyApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, authorize('firm', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('student'), withdrawApplication);
router.post('/:id/interview', protect, authorize('firm'), scheduleInterview);
router.post('/:id/offer', protect, authorize('firm'), sendOffer);

module.exports = router;
