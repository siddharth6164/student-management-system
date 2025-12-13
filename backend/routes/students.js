const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Create student
router.post(
    '/',
    auth,
    [body('name').notEmpty(), body('email').isEmail()],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            const exists = await Student.findOne({ email: req.body.email });
            if (exists) return res.status(409).json({ message: 'Email already exists' });
            const s = await Student.create(req.body);
            res.status(201).json(s);
        } catch (err) { next(err); }
    }
);

// GET /students?search=&page=&limit=
router.get(
    '/',
    auth,
    [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })],
    async (req, res, next) => {
        try {
            const { search = '', page = 1, limit = 10 } = req.query;
            const q = {};
            // if (search) {
            //     q.$or = [
            //         { name: new RegExp(search, 'i') },
            //         { email: new RegExp(search, 'i') },
            //     ];
            // }
            //
            if (search) {
                const orConditions = [
                    { name: new RegExp(search, 'i') },
                    { email: new RegExp(search, 'i') },
                    { phone: new RegExp(search, 'i') }, // optional
                ];

                // ✅ studentId numeric search
                if (!isNaN(search)) {
                    orConditions.push({ studentId: Number(search) });
                }

                q.$or = orConditions;
            }
            //
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                Student.find(q).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
                Student.countDocuments(q),
            ]);
            res.json({ data, total, page: Number(page), limit: Number(limit) });
        } catch (err) { next(err); }
    }
);

// GET by id
router.get('/:id', auth, [param('id').isMongoId()], async (req, res, next) => {
    try {
        const s = await Student.findById(req.params.id);
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json(s);
    } catch (err) { next(err); }
});

// Update
router.put('/:id', auth, [param('id').isMongoId(), body('email').optional().isEmail()], async (req, res, next) => {
    try {
        const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json(s);
    } catch (err) { next(err); }
});

// Delete
router.delete('/:id', auth, [param('id').isMongoId()], async (req, res, next) => {
    try {
        const s = await Student.findByIdAndDelete(req.params.id);
        if (!s) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
