const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true } // bcrypt hash, plain text kabhi nahi
});

module.exports = mongoose.model('User', userSchema);