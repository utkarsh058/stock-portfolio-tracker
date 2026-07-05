const Alert = require('../models/Alert');
const axios = require('axios');

// GET all alerts for logged-in user, WITH live price + triggered status
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });

    const alertsWithStatus = await Promise.all(
      alerts.map(async (alert) => {
        try {
          const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol: alert.symbol, token: process.env.FINNHUB_API_KEY },
          });
          const currentPrice = response.data.c;

          // Check if alert condition is met
          const triggered =
            alert.condition === 'above'
              ? currentPrice >= alert.targetPrice
              : currentPrice <= alert.targetPrice;

          return { ...alert._doc, currentPrice, triggered };
        } catch (err) {
          return { ...alert._doc, currentPrice: null, triggered: false };
        }
      })
    );

    res.status(200).json(alertsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new alert
const addAlert = async (req, res) => {
  try {
    const { symbol, targetPrice, condition } = req.body;
    const newAlert = new Alert({ user: req.userId, symbol, targetPrice, condition });
    const saved = await newAlert.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE an alert
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    if (alert.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await alert.deleteOne();
    res.status(200).json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlerts, addAlert, deleteAlert };