const express = require('express');
const router = express.Router();
const { getAllStocks, addStock, deleteStock } = require('../controllers/stockController');
const protect = require('../config/authMiddleware');

router.get('/', protect, getAllStocks);
router.post('/', protect, addStock);
router.delete('/:id', protect, deleteStock);

module.exports = router;