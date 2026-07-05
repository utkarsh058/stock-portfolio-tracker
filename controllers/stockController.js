const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const Snapshot = require('../models/Snapshot');
const axios = require('axios');

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.userId });

    const stocksWithLiveData = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol: stock.symbol, token: process.env.FINNHUB_API_KEY },
          });

          const currentPrice = response.data.c;
          const investedAmount = stock.buyPrice * stock.quantity;
          const currentValue = currentPrice * stock.quantity;
          const gainLoss = Number((currentValue - investedAmount).toFixed(2));
          const gainLossPercent = ((gainLoss / investedAmount) * 100).toFixed(2);

          return { ...stock._doc, currentPrice, investedAmount, currentValue, gainLoss, gainLossPercent };
        } catch (err) {
          return { ...stock._doc, currentPrice: null, error: 'Price unavailable' };
        }
      })
    );

    // Save today's snapshot of total portfolio value
    const totalValue = stocksWithLiveData.reduce((sum, s) => sum + (s.currentValue || 0), 0);
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    await Snapshot.findOneAndUpdate(
      { user: req.userId, date: today },
      { totalValue },
      { upsert: true }
    );

    res.status(200).json(stocksWithLiveData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStock = async (req, res) => {
  try {
    const { symbol, companyName, quantity, buyPrice } = req.body;
    const newStock = new Stock({ user: req.userId, symbol, companyName, quantity, buyPrice });
    const savedStock = await newStock.save();

    await new Transaction({
      user: req.userId, symbol, type: 'Buy', quantity, price: buyPrice,
    }).save();

    res.status(201).json(savedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    if (stock.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this stock' });
    }

    await new Transaction({
      user: req.userId, symbol: stock.symbol, type: 'Sell', quantity: stock.quantity, price: stock.buyPrice,
    }).save();

    await stock.deleteOne();
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStocks, addStock, deleteStock };