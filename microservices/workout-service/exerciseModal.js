const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    muscleGroup: { type: String, required: true },
    equipment: { type: String, required: true },
    description: { type: String, required: true },
    repetitions: { type: Number, required: true },
    calories: { type: Number, required: true }  // Add calories field
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
