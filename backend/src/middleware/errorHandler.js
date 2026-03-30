const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Only log full errors with stack traces in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error Details:', err);
    } else {
        console.error('Error:', err.message);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        return res.status(404).json({ success: false, message: error.message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `Duplicate value for ${field}`;
        return res.status(400).json({ success: false, message: error.message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' && (!err.statusCode || err.statusCode === 500) 
            ? 'Server Error' 
            : error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString()
    });
};

module.exports = { errorHandler };
