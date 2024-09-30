const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Exercise = require('./models'); // Import the Exercise model
const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI (replace <password> with actual MongoDB password)
mongoose.connect('mongodb://localhost:27017/fitnessDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Endpoint to create a new exercise
app.post('/create-exercise', async (req, res) => {
    const { name, muscleGroup, equipment, description, repetitions, calories } = req.body;  // Include calories
    console.log(req.body);
    try {
        const newExercise = new Exercise({ name, muscleGroup, equipment, description, repetitions, calories });
        await newExercise.save();
        res.status(201).json({ message: 'Exercise created successfully', exercise: newExercise });
    } catch (error) {
        res.status(400).json({ message: 'Error creating exercise', error });
    }
});


// Endpoint to fetch all exercises with pagination
app.get('/exercises', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 exercises
    try {
        const exercises = await Exercise.find()
            .limit(Number(limit)) // Limit the number of exercises
            .skip((page - 1) * limit) // Skip exercises for pagination
            .exec();
        const count = await Exercise.countDocuments(); // Get the total number of exercises

        res.status(200).json({
            exercises,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercises', error });
    }
});

// In your exercise service (e.g., exerciseService/index.js)

app.get('/exercise-distribution', async (req, res) => {
    try {
        const exerciseCounts = await Exercise.aggregate([
            { $group: { _id: "$muscleGroup", count: { $sum: 1 } } },
            { $project: { muscleGroup: "$_id", count: 1, _id: 0 } }
        ]);
        res.status(200).json(exerciseCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercise distribution', error });
    }
});


// Endpoint to delete an exercise by ID
app.delete('/exercise/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const exercise = await Exercise.findByIdAndDelete(id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exercise', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Exercise service running at http://localhost:${port}`);
});
