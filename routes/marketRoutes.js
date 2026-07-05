const express = require('express');
const router = express.Router();
const { getIndices } = require('../controllers/marketController');
const protect = require('../config/authMiddleware');

router.get('/indices', protect, getIndices);

module.exports = router;