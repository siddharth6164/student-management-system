require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204,
    maxAge: 60 * 60 * 24
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with error handling for Vercel)
try {
    connectDB(process.env.MONGO_URI || 'mongodb+srv://siddhu33singh_db_user:siddharth@cluster0.pdvdbpx.mongodb.net/?appName=Cluster0');
} catch (error) {
    console.error('MongoDB connection failed:', error);
}

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

// Only start server in development (not on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
}

// Export for Vercel
module.exports = app;
