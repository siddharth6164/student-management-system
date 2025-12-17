require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// FIRST: Handle CORS before anything else
app.use((req, res, next) => {
    // Set CORS headers for every request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS requests immediately
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
});

// SECOND: Use CORS middleware as backup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/sms');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// CORS test endpoint - must work first
app.get('/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working perfectly!',
        origin: req.headers.origin,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'SMS API running',
        ok: true,
        timestamp: new Date().toISOString()
    });
});

// Error handler must be last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
});
