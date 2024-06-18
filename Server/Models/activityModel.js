const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Ongoing', 'Paused', 'Completed'], default: 'Pending' },
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // in seconds
  history: [
    {
      action: { type: String, enum: ['Start', 'Pause', 'Resume', 'End'] },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Activity', ActivitySchema);