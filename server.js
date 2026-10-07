require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());

// serverless me har request pe naya connection na bane, isliye cache
let dbPromise;
function connectDB() {
  if (!dbPromise) dbPromise = mongoose.connect(process.env.MONGO_URI);
  return dbPromise;
}

app.post('/api/login', async (req, res) => {
  try {
    await connectDB();
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    const ok = user && await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// local pe chalane ke liye (node server.js)
if (require.main === module) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'public')));
  app.listen(process.env.PORT || 3000, () => console.log('Server on http://localhost:' + (process.env.PORT || 3000)));
}

// Vercel ke liye
module.exports = app;