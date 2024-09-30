const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Workout = require('./models'); // Import the Workout model
const Exercise = require("./exerciseModal");

const app = express();
const port = 3003; // Port for the workout service

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fitnessDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for Workout Service'))
.catch(err => console.error('MongoDB connection error:', err));

// Endpoint to create a new workout
app.post('/create-workout', async (req, res) => {
    const { name, exercises, duration, difficulty, calories } = req.body; // Include calories in request body
    try {
        const newWorkout = new Workout({ name, exercises, duration, difficulty, calories });
        await newWorkout.save();
        res.status(201).json({ message: 'Workout created successfully', workout: newWorkout });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error creating workout', error });
    }
});

// Endpoint to fetch all workouts with pagination
app.get('/workouts', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const workouts = await Workout.find()
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .exec();

        const count = await Workout.countDocuments();
        res.status(200).json({
            workouts,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workouts', error });
    }
});

// In your workout service (e.g., workoutService/index.js)

app.get('/workout-status', async (req, res) => {
    try {
        const workoutCounts = await Workout.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { status: "$_id", count: 1, _id: 0 } }
        ]);
        res.status(200).json(workoutCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workout status', error });
    }
});


// get to delete a workout by ID
app.get('/workout/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const workout = await Workout.findById(id);
        const exercisesDetails = await Promise.all(
            workout.exercises.map(async (work) => {
                return await Exercise.findById(work);
            })
        );
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({
            workout,
            exercisesDetails,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout', error });
    }
});

// Endpoint to delete a workout by ID
app.delete('/workout/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const workout = await Workout.findByIdAndDelete(id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout', error });
    }
});

// Endpoint to update the workout status
app.patch('/workout/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate that the status is either 'in progress' or 'completed'
    if (!['in progress', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be either "in progress" or "completed".' });
    }

    try {
        const workout = await Workout.findByIdAndUpdate(id, { status }, { new: true });
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({ message: 'Workout status updated successfully', workout });
    } catch (error) {
        res.status(500).json({ message: 'Error updating workout status', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Workout service running at http://localhost:${port}`);
});
