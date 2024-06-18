const express = require('express');
const Activity = require('../Models/activityModel');
const {authMiddleware} = require('../Middlewares/IsAuth');
const router = express.Router();
const mongoose = require('mongoose');


// Middleware to check if there is any ongoing activity
async function checkOngoingActivity(req, res, next) {
  // const ongoingActivity = await Activity.findOne({ user: req.user._id, status: 'Ongoing' });
  // if (ongoingActivity) {
  //   return res.status(400).json({ message: 'An activity is already ongoing. Please pause or end it before starting or resuming another activity.' });
  // }
  // next();
  const { id, action } = req.params;

  // Allow pause and end actions to bypass the check for ongoing activities
  if (['pause', 'end'].includes(action)) {
    return next();
  }

  // Check if there's any other ongoing activity
  const ongoingActivity = await Activity.findOne({ user: req.user._id, status: 'Ongoing' });
  if (ongoingActivity && ongoingActivity._id.toString() !== id) {
    return res.status(400).json({ message: 'An activity is already ongoing. Please pause or end it before starting or resuming another activity.' });
  }

  next();
}

router.use(authMiddleware);

// Add Activity
router.post('/add', async (req, res) => {
  const { name } = req.body;
  try {
    const activity = new Activity({ user: req.user.id, name });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Activity
router.put('/:id/:action',checkOngoingActivity, async (req, res) => {
  const { id, action } = req.params;
  try {
    const activity = await Activity.findById(id);
    if (!activity || activity.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (action === 'start') {
      if (activity.status !== 'Pending') return res.status(400).json({ error: 'Activity cannot be started' });
      activity.status = 'Ongoing';
      activity.startTime = new Date();
    } 
    else if (action === 'pause') {
      if (activity.status !== 'Ongoing') return res.status(400).json({ error: 'Activity cannot be paused' });
      activity.status = 'Paused';
      activity.duration += Math.floor((new Date() - activity.startTime) / 1000);
    } 
    else if (action === 'resume') {
      if (activity.status !== 'Paused') return res.status(400).json({ error: 'Activity cannot be resumed' });
      activity.status = 'Ongoing';
      activity.startTime = new Date();
    } 
    else if (action === 'end') {
      if (activity.status !== 'Ongoing') return res.status(400).json({ error: 'Activity cannot be ended' });
      activity.status = 'Completed';
      activity.duration += Math.floor((new Date() - activity.startTime) / 1000);
      activity.endTime = new Date();
    } 
    else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    activity.history.push({ action: action.charAt(0).toUpperCase() + action.slice(1) });
    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ObjectId' });
  }
  next();
};
router.put('/:id', validateObjectId, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedActivity = await Activity.findByIdAndUpdate( id, { name }, { new: true } );// This option returns the updated document
    if (!updatedActivity) { return res.status(404).json({ error: 'Activity not found' }); }
    res.json(updatedActivity);
  }
  catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'An error occurred while updating the activity' });
  }
})

router.delete('/delete/:id', async (req,res)=>{
  const { id } = req.params;
  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) { return res.status(404).json({ error: 'Activity not found' }); }
    res.json({ message: 'Activity deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'An error occurred while deleting the activity' });
  }
})

router.get('/:id', authMiddleware, validateObjectId, async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findById(id);
    if (!activity || activity.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;