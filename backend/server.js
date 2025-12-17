require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Manual CORS headers - more explicit approach
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Also use cors middleware as backup
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/sms');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => res.json({ message: 'SMS API running', ok: true }));

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

// Error handler must be last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
});
