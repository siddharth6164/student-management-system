const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/login
router.post(
    '/login',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    async (req, res, next) => {
        try {
            console.log('Login attempt:', req.body);
            console.log('Environment check:', {
                hasMongoUri: !!process.env.MONGO_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                hasAdminEmail: !!process.env.ADMIN_EMAIL,
                hasAdminPassword: !!process.env.ADMIN_PASSWORD
            });

            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { email, password } = req.body;

            // try to find user in DB
            let user = await User.findOne({ email });
            console.log('User found in DB:', !!user);

            if (user) {
                const match = await user.comparePassword(password);
                if (!match) return res.status(401).json({ message: 'Invalid credentials..' });
            } else {
                // fallback: allow admin via env credentials (convenience)
                console.log('Checking admin credentials:', {
                    emailMatch: email === process.env.ADMIN_EMAIL,
                    passwordMatch: password === process.env.ADMIN_PASSWORD
                });

                if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                    return res.status(401).json({ message: 'Invalid credentials...' });
                }

                // create or find admin user
                user = await User.findOneAndUpdate(
                    { email },
                    { email, name: 'Admin', password },
                    { upsert: true, new: true }
                );
                console.log('Admin user created/found:', !!user);
            }

            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
            console.log('Token generated successfully');
            res.json({ token });
        } catch (err) {
            console.error('Login error:', err);
            next(err);
        }
    }
);

module.exports = router;
