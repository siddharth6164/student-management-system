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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Try to find user in database
            let user = await User.findOne({ email });

            if (user) {
                // User exists, check password
                const match = await user.comparePassword(password);
                if (!match) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                // User doesn't exist, check if it's admin credentials
                if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Create admin user
                user = await User.findOneAndUpdate(
                    { email },
                    { email, name: 'Admin', password },
                    { upsert: true, new: true }
                );
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
