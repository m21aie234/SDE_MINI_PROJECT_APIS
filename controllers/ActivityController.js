// controllers/ActivityController.js
const Activity = require('../models/Activity');

// Create a new activity
exports.createActivity = async (req, res) =>
{
    const { type, duration, caloriesBurned } = req.body;
    try
    {
        const activity = new Activity({
            user: req.user.id,
            type,
            duration,
            caloriesBurned,
        });
        await activity.save();
        res.status(201).json(activity);
    } catch (error)
    {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Get user activities
exports.getUserActivities = async (req, res) =>
{
    try
    {
        const activities = await Activity.find({ user: req.user.id });
        res.json(activities);
    } catch (error)
    {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getActivityStats = async (req, res) => {
    try {
      // Count total activities
      const totalActivities = await Activity.countDocuments();
      
      // Aggregate total duration of all activities
      const totalDuration = await Activity.aggregate([
        { $group: { _id: null, totalDuration: { $sum: '$duration' } } },
      ]);
  
      // Aggregate total calories burned in all activities
      const totalCaloriesBurned = await Activity.aggregate([
        { $group: { _id: null, totalCaloriesBurned: { $sum: '$caloriesBurned' } } },
      ]);
  
      // Send response with calculated stats
      res.json({
        totalActivities,
        totalDuration: totalDuration[0]?.totalDuration || 0,
        totalCaloriesBurned: totalCaloriesBurned[0]?.totalCaloriesBurned || 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch activity stats', error });
    }
  };