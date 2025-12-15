const express = require('express');
const router = express.Router();
const axios = require('axios');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Get top cryptocurrencies
router.get('/markets', async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching crypto data' });
  }
});

// Get specific coin details
router.get('/coin/:id', async (req, res) => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coin data' });
  }
});

// Get price chart data
router.get('/chart/:id', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const response = await axios.get(`${COINGECKO_API}/coins/${req.params.id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
});

module.exports = router;
