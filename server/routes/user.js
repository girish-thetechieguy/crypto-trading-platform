const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get portfolio
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('portfolio walletBalance');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update watchlist
router.post('/watchlist/:coinId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { coinId } = req.params;

    if (user.watchlist.includes(coinId)) {
      user.watchlist = user.watchlist.filter(id => id !== coinId);
    } else {
      user.watchlist.push(coinId);
    }

    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
