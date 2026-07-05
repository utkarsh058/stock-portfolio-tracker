const Transaction = require('../models/Transaction');
const Dividend = require('../models/Dividend');

// GET all transactions for logged-in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all dividends for logged-in user
const getDividends = async (req, res) => {
  try {
    const dividends = await Dividend.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(dividends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new dividend entry
const addDividend = async (req, res) => {
  try {
    const { symbol, amount, shares } = req.body;
    const newDividend = new Dividend({ user: req.userId, symbol, amount, shares });
    const saved = await newDividend.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a dividend entry
const deleteDividend = async (req, res) => {
  try {
    const dividend = await Dividend.findById(req.params.id);
    if (!dividend) {
      return res.status(404).json({ message: 'Dividend not found' });
    }
    if (dividend.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await dividend.deleteOne();
    res.status(200).json({ message: 'Dividend deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, getDividends, addDividend, deleteDividend };