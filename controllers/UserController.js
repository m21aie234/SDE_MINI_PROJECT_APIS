// controllers/UserController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register new user
exports.registerUser = async (req, res) =>
{
    const { name, email, password } = req.body;
    try
    {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error)
    {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User login
exports.loginUser = async (req, res) =>
{
    const { email, password } = req.body;
    try
    {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password)))
        {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else
        {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error)
    {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) =>
{
    const user = await User.findById(req.user.id);
    if (user)
    {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            height: user.height,
            weight: user.weight,
            goals: user.goals,
        });
    } else
    {
        res.status(404).json({ message: 'User not found' });
    }
};
