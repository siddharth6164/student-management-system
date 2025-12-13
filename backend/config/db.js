const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ MongoDB connected:', mongoUri);
    } catch (err) {
        console.error('✗ MongoDB connection error:', err.message);
        console.error('  Make sure MongoDB is running locally or connection string is correct');
        process.exit(1);
    }
};

module.exports = connectDB;
