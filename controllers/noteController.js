const Note = require('../models/Note');

// GET all notes for logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 }); // newest first
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new note
const addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ user: req.userId, title, content });
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await note.deleteOne();
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, addNote, deleteNote };