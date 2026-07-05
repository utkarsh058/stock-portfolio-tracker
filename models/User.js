const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,      // no two users can have the same email
    lowercase: true,   // auto-converts "John@Gmail.com" to "john@gmail.com"
  },
  password: {
    type: String,
    required: true,    // this will store the ENCRYPTED password, never the real one
  },
}, { timestamps: true }); // automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);