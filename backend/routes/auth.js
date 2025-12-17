const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// POST /auth/login
router.post(
    '/login',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({ message: 'Server misconfigured: missing JWT_SECRET' });
            }

            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;
            const isAdminCreds = adminEmail && adminPassword && email === adminEmail && password === adminPassword;

            if (isAdminCreds) {
                const payload = { id: 'admin', email: adminEmail, role: 'admin' };
                const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

                if (mongoose.connection.readyState === 1) {
                    User.findOneAndUpdate(
                        { email: adminEmail },
                        { email: adminEmail, name: 'Admin', password: adminPassword },
                        { upsert: true, new: true }
                    ).catch((err) => console.warn('Failed to sync admin user:', err.message));
                }

                return res.json({ token });
            }

            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
            }

            let user = await User.findOne({ email });

            if (user) {
                const match = await user.comparePassword(password);
                if (!match) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ token });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
