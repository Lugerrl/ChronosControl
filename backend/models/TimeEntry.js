const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date }
});

module.exports = mongoose.model('TimeEntry', TimeEntrySchema);
