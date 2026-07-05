const express = require('express');
const router = express.Router();
const { getSnapshots, addTestSnapshot } = require('../controllers/snapshotController');
const protect = require('../config/authMiddleware');

router.get('/', protect, getSnapshots);
router.post('/', protect, addTestSnapshot); // TEMPORARY - for testing only

module.exports = router;