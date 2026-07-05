const Snapshot = require('../models/Snapshot');

const getSnapshots = async (req, res) => {
  try {
    const snapshots = await Snapshot.find({ user: req.userId }).sort({ date: 1 });
    res.status(200).json(snapshots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEMPORARY - for testing only: manually create a snapshot with a custom date/value
const addTestSnapshot = async (req, res) => {
  try {
    const { date, totalValue } = req.body;
    const saved = await Snapshot.findOneAndUpdate(
      { user: req.userId, date },
      { totalValue },
      { upsert: true, new: true }
    );
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSnapshots, addTestSnapshot };