// models/Workout.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    exercises: {
        type: [String], // Array of exercise names or exercise IDs
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    calories: {
        type: Number, // Calories burned during the workout
        required: true,
    },
    status: {
        type: String,
        enum: ['in progress', 'completed'],
        default: 'in progress',
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);
module.exports = Workout;
