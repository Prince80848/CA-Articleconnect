const router = require('express').Router();
const { getProfile, getUserById, updateProfile, uploadAvatar, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.delete('/account', protect, deleteAccount);
router.get('/:id', protect, getUserById);

module.exports = router;
