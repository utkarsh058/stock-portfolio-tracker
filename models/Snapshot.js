const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // stored as "YYYY-MM-DD" for easy daily grouping
  totalValue: { type: Number, required: true },
});

// Ensures only ONE snapshot per user per day (updates instead of duplicating)
snapshotSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Snapshot', snapshotSchema);