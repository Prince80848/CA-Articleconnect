const router = require('express').Router();
const { getMyFirm, updateFirm, getAllFirms, getFirmById } = require('../controllers/firmController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, authorize('firm'), getMyFirm);
router.put('/me', protect, authorize('firm'), updateFirm);
router.get('/', protect, getAllFirms);
router.get('/:id', protect, getFirmById);

module.exports = router;
