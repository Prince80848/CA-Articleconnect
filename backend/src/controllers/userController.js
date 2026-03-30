const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) { next(error); }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-refreshToken');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updates = {};
        ['name', 'phone', 'avatar'].forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, data: user, message: 'Profile updated' });
    } catch (error) { next(error); }
};

exports.uploadAvatar = async (req, res, next) => {
    try {
        // In production, upload to Cloudinary and get URL
        const avatarUrl = req.body.avatar || '/uploads/default-avatar.png';
        const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
        res.json({ success: true, data: { avatar: user.avatar }, message: 'Avatar updated' });
    } catch (error) { next(error); }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isActive: false });
        res.json({ success: true, message: 'Account deactivated' });
    } catch (error) { next(error); }
};
