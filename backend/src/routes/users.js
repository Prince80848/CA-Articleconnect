const router = require('express').Router();
const { getProfile, getUserById, updateProfile, uploadAvatar, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/account', protect, deleteAccount);
router.get('/:id', protect, getUserById);

module.exports = router;
