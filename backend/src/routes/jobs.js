const router = require('express').Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, closeJob, getJobApplications, getMyJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { requireFirmVerification } = require('../middleware/firmVerification');

router.get('/my-jobs', protect, authorize('firm'), getMyJobs);
router.post('/', protect, authorize('firm'), requireFirmVerification, createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, authorize('firm', 'admin'), updateJob);
router.delete('/:id', protect, authorize('firm', 'admin'), deleteJob);
router.post('/:id/close', protect, authorize('firm', 'admin'), closeJob);
router.get('/:id/applications', protect, authorize('firm', 'admin'), getJobApplications);

module.exports = router;
