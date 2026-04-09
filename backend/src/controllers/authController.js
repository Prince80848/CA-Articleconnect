const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Student = require('../models/Student');
const Firm = require('../models/Firm');

const generateToken = (id) => jwt.sign({ id }, (process.env.JWT_SECRET || '').trim(), { expiresIn: process.env.JWT_EXPIRE ? process.env.JWT_EXPIRE.trim() : '7d' });
const generateRefreshToken = (id) => jwt.sign({ id }, (process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || '').trim(), { expiresIn: '30d' });

const googleClient = new OAuth2Client((process.env.GOOGLE_CLIENT_ID || '').trim());

// Register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

        const user = await User.create({ name, email, password, role, phone, emailVerified: true });

        // Create role-specific profile
        let profile = null;
        if (role === 'student') {
            profile = await Student.create({ userId: user._id });
        } else if (role === 'firm') {
            profile = await Firm.create({ userId: user._id, firmName: req.body.firmName || name });
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, profile, token, refreshToken },
            message: 'Registration successful'
        });
    } catch (error) { next(error); }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        if (!user.isActive) return res.status(403).json({ success: false, message: 'Account is suspended' });

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        let profile = null;
        if (user.role === 'student') profile = await Student.findOne({ userId: user._id });
        else if (user.role === 'firm') profile = await Firm.findOne({ userId: user._id });

        res.json({
            success: true,
            data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }, profile, token, refreshToken },
            message: 'Login successful'
        });
    } catch (error) { next(error); }
};

// Google Auth API
exports.googleAuth = async (req, res, next) => {
    try {
        const { idToken, role = 'student', firmName } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: (process.env.GOOGLE_CLIENT_ID || '').trim(),
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        
        let user = await User.findOne({ email });
        let profile = null;

        if (!user) {
            // Register a new user if one doesn't exist
            // Google authenticated users have verified emails
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name,
                email,
                avatar: picture,
                password: randomPassword,
                role: role,
                emailVerified: true
            });

            if (role === 'student') {
                profile = await Student.create({ userId: user._id });
            } else if (role === 'firm') {
                profile = await Firm.create({ userId: user._id, firmName: firmName || name });
            }
        } else {
            if (!user.isActive) return res.status(403).json({ success: false, message: 'Account is suspended' });
            
            // Get profile for existing user
            if (user.role === 'student') profile = await Student.findOne({ userId: user._id });
            else if (user.role === 'firm') profile = await Firm.findOne({ userId: user._id });
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        if (!user.avatar && picture) user.avatar = picture;
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            data: { 
                user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, 
                profile, 
                token, 
                refreshToken 
            },
            message: 'Google Auth successful'
        });
    } catch (error) { 
        console.error("Google Auth error:", error);
        res.status(401).json({ success: false, message: 'Google authentication failed' });
    }
};

// Get profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        let profile = null;
        if (user.role === 'student') profile = await Student.findOne({ userId: user._id });
        else if (user.role === 'firm') profile = await Firm.findOne({ userId: user._id });

        res.json({ success: true, data: { user, profile } });
    } catch (error) { next(error); }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true });
        res.json({ success: true, data: user, message: 'Profile updated' });
    } catch (error) { next(error); }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });

        const decoded = jwt.verify(refreshToken, (process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || '').trim());
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const newToken = generateToken(user._id);
        res.json({ success: true, data: { token: newToken } });
    } catch (error) { next(error); }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // In production, send email with reset link
        res.json({ success: true, message: 'Password reset token generated', data: { resetToken } });
    } catch (error) { next(error); }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) { next(error); }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ emailVerifyToken: token });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid verification token' });

        user.emailVerified = true;
        user.emailVerifyToken = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) { next(error); }
};

// Logout
exports.logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) { next(error); }
};
