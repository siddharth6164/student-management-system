require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Ultra-permissive CORS - handle all requests
app.use('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        return res.status(200).json({ message: 'CORS preflight OK' });
    }
    next();
});

// Standard CORS middleware as backup
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false
}));

app.use(express.json());

// Simple CORS test endpoint - should work immediately
app.all('/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working!',
        method: req.method,
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/sms');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Root health check
app.get('/', (req, res) => {
    res.json({
        message: 'SMS API running',
        ok: true,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to verify CORS
app.get('/test', (req, res) => {
    res.json({
        message: 'CORS test endpoint',
        timestamp: new Date().toISOString(),
        headers: req.headers
    });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API test endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Debug endpoint to check environment variables
app.get('/debug/env', (req, res) => {
    res.json({
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD,
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
    });
});

// Error handler must be last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
});
