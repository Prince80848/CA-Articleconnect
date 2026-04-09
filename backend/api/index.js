require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/database');

// Connect to MongoDB immediately
connectDB();

// Export the express app for Vercel Serverless
module.exports = app;
