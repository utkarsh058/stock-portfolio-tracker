const mongoose = require('mongoose');

// This defines the "shape" of a Stock entry in our database
const stockSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,   // automatically converts "aapl" to "AAPL"
  },
  companyName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  buyPrice: {
    type: Number,
    required: true,
  },
  buyDate: {
    type: Date,
    default: Date.now,   // automatically sets today's date if not provided
  },
});

// This creates a "Stock" model based on the schema above
// Mongoose will create a collection called "stocks" in MongoDB
module.exports = mongoose.model('Stock', stockSchema);