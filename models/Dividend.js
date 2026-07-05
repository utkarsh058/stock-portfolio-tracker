const mongoose = require('mongoose');

const dividendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  amount: { type: Number, required: true },
  shares: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Dividend', dividendSchema);