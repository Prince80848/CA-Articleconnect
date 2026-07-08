const router = require('express').Router();
const { getMyProfile, updateProfile, getAllStudents, getStudentById, upgradeToPremium, uploadResume, downloadResume } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', protect, authorize('student'), getMyProfile);
router.put('/me', protect, authorize('student'), updateProfile);
router.post('/upgrade', protect, authorize('student'), upgradeToPremium);
router.post('/upload-resume', protect, authorize('student'), upload.single('resume'), uploadResume);
// Proxy download – streams Cloudinary raw URL via our server so browser gets a proper Save dialog
router.get('/resume-download', protect, downloadResume);
router.get('/', protect, authorize('firm', 'admin'), getAllStudents);
router.get('/:id', protect, getStudentById);

module.exports = router;
