const express = require('express');
const router = express.Router();
const { getTransactions, getDividends, addDividend, deleteDividend } = require('../controllers/transactionController');
const protect = require('../config/authMiddleware');

router.get('/transactions', protect, getTransactions);
router.get('/dividends', protect, getDividends);
router.post('/dividends', protect, addDividend);
router.delete('/dividends/:id', protect, deleteDividend);

module.exports = router;