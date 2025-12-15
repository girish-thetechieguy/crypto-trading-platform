const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Buy crypto
router.post('/buy', auth, async (req, res) => {
  try {
    const { coinId, coinSymbol, coinName, amount, pricePerUnit } = req.body;
    const totalValue = amount * pricePerUnit;

    const user = await User.findById(req.user.userId);

    // Check balance
    if (user.walletBalance < totalValue) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update wallet
    user.walletBalance -= totalValue;

    // Update portfolio
    const existingCoin = user.portfolio.find(p => p.coinId === coinId);
    if (existingCoin) {
      const totalAmount = existingCoin.amount + amount;
      const totalCost = (existingCoin.amount * existingCoin.averageBuyPrice) + totalValue;
      existingCoin.amount = totalAmount;
      existingCoin.averageBuyPrice = totalCost / totalAmount;
    } else {
      user.portfolio.push({
        coinId,
        symbol: coinSymbol,
        name: coinName,
        amount,
        averageBuyPrice: pricePerUnit
      });
    }

    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'buy',
      coinId,
      coinSymbol,
      coinName,
      amount,
      pricePerUnit,
      totalValue
    });

    await transaction.save();

    res.json({ message: 'Purchase successful', transaction, walletBalance: user.walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sell crypto
router.post('/sell', auth, async (req, res) => {
  try {
    const { coinId, coinSymbol, coinName, amount, pricePerUnit } = req.body;
    const totalValue = amount * pricePerUnit;

    const user = await User.findById(req.user.userId);

    // Check portfolio
    const existingCoin = user.portfolio.find(p => p.coinId === coinId);
    if (!existingCoin || existingCoin.amount < amount) {
      return res.status(400).json({ message: 'Insufficient crypto balance' });
    }

    // Update wallet
    user.walletBalance += totalValue;

    // Update portfolio
    existingCoin.amount -= amount;
    if (existingCoin.amount === 0) {
      user.portfolio = user.portfolio.filter(p => p.coinId !== coinId);
    }

    await user.save();

    // Create transaction
    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'sell',
      coinId,
      coinSymbol,
      coinName,
      amount,
      pricePerUnit,
      totalValue
    });

    await transaction.save();

    res.json({ message: 'Sale successful', transaction, walletBalance: user.walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
