const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Route imports
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const firmRoutes = require('./routes/firms');
const studentRoutes = require('./routes/students');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const { checkSubscriptionExpiry } = require('./middleware/subscriptionCheck');

const app = express();

// Middleware
// Trust proxy if running behind a reverse proxy (like Render, Heroku)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allows serving images/uploads across origins if needed
}));

// Compress Responses
app.use(compression());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs (adjustable)
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// Apply rate limiter specifically to API routes
app.use('/api', apiLimiter);

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : (process.env.FRONTEND_URL || 'http://localhost:5173'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'CA Articleship API is running', timestamp: new Date().toISOString() });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
// Auto-expire subscriptions on each authenticated request
app.use('/api', checkSubscriptionExpiry);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/firms', firmRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

module.exports = app;
