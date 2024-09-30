// models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    duration: { type: Number, required: true }, // In minutes
    caloriesBurned: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);
