const express = require('express');
const router = express.Router();
const { getAlerts, addAlert, deleteAlert } = require('../controllers/alertController');
const protect = require('../config/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/', protect, addAlert);
router.delete('/:id', protect, deleteAlert);

module.exports = router;