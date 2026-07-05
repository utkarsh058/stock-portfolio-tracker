const Watchlist = require('../models/Watchlist');
const axios = require('axios');

// GET all watchlist items for logged-in user, with live prices
const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.userId });

    const itemsWithPrices = await Promise.all(
      items.map(async (item) => {
        try {
          const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol: item.symbol, token: process.env.FINNHUB_API_KEY },
          });
          const currentPrice = response.data.c;
          const change = response.data.d;       // change in price
          const changePercent = response.data.dp; // change in percent

          return { ...item._doc, currentPrice, change, changePercent };
        } catch (err) {
          return { ...item._doc, currentPrice: null, error: 'Price unavailable' };
        }
      })
    );

    res.status(200).json(itemsWithPrices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add a new stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, companyName } = req.body;
    const newItem = new Watchlist({ user: req.userId, symbol, companyName });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE remove from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await item.deleteOne();
    res.status(200).json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };