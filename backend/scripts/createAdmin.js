require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sms');
        console.log('✓ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@sms.com' });

        if (existingAdmin) {
            console.log('✓ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@sms.com',
            password: 'Admin@123' // This will be hashed by the User model
        });

        await adminUser.save();
        console.log('✓ Admin user created successfully');
        console.log('  Email: admin@sms.com');
        console.log('  Password: Admin@123');

    } catch (error) {
        console.error('✗ Error creating admin user:', error.message);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdminUser();