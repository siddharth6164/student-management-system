const mongoose = require('mongoose');

// Simple counter collection for sequential IDs
const CounterSchema = new mongoose.Schema({
    _id: { type: String },
    seq: { type: Number, default: 10000 },
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const StudentSchema = new mongoose.Schema({
    studentId: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    class: { type: String },
    phone: { type: String },
}, { timestamps: true });

// Auto-generate sequential studentId starting from 10001
StudentSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    if (this.studentId) return next();
    try {
        // Ensure counter doc exists without conflicting updates
        await Counter.updateOne(
            { _id: 'studentId' },
            { $setOnInsert: { seq: 10000 } },
            { upsert: true }
        );

        const updated = await Counter.findOneAndUpdate(
            { _id: 'studentId' },
            { $inc: { seq: 1 } },
            { new: true }
        );
        this.studentId = updated.seq;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Student', StudentSchema);
