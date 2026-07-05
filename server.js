// 1. Import the tools we installed earlier
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. Create our server app
const app = express();

// 3. Middleware - things that run on every request
app.use(cors());           // allows frontend to talk to this backend
app.use(express.json());   // allows server to understand JSON data sent by frontend

const stockRoutes = require('./routes/stockRoutes');
app.use('/api/stocks', stockRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const watchlistRoutes = require('./routes/watchlistRoutes');
app.use('/api/watchlist', watchlistRoutes);

const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

const alertRoutes = require('./routes/alertRoutes');
app.use('/api/alerts', alertRoutes);

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api', transactionRoutes);

const snapshotRoutes = require('./routes/snapshotRoutes');
app.use('/api/snapshots', snapshotRoutes);

const marketRoutes = require('./routes/marketRoutes');
app.use('/api/market', marketRoutes);

// 4. Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// 5. A simple test route to check the server is alive
app.get('/', (req, res) => {
  res.send('Stock Portfolio API is running...');
});

// 6. Start the server, listening on the port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});