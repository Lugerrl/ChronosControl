const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Clock in
router.post('/clock-in', authenticate, async (req, res) => {
  try {
    const entry = new TimeEntry({
      user: req.userId,
      clockIn: new Date()
    });
    await entry.save();
    res.json({ message: 'Clocked in', entry });
  } catch (err) {
    res.status(500).json({ error: 'Clock-in failed' });
  }
});

// Clock out
router.post('/clock-out', authenticate, async (req, res) => {
  try {
    const entry = await TimeEntry.findOne({ user: req.userId, clockOut: null }).sort({ clockIn: -1 });
    if (!entry) return res.status(404).json({ error: 'No active clock-in found' });

    entry.clockOut = new Date();
    await entry.save();
    res.json({ message: 'Clocked out', entry });
  } catch (err) {
    res.status(500).json({ error: 'Clock-out failed' });
  }
});

module.exports = router;
