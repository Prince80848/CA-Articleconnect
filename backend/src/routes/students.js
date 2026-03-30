const router = require('express').Router();
const { getMyProfile, updateProfile, getAllStudents, getStudentById, upgradeToPremium, uploadResume } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', protect, authorize('student'), getMyProfile);
router.put('/me', protect, authorize('student'), updateProfile);
router.post('/upgrade', protect, authorize('student'), upgradeToPremium);
router.post('/upload-resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/', protect, authorize('firm', 'admin'), getAllStudents);
router.get('/:id', protect, getStudentById);

module.exports = router;
