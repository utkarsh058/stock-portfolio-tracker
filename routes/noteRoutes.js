const express = require('express');
const router = express.Router();
const { getNotes, addNote, deleteNote } = require('../controllers/noteController');
const protect = require('../config/authMiddleware');

router.get('/', protect, getNotes);
router.post('/', protect, addNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;