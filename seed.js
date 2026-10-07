require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Apne 5 users yahan daalo (password min 6 chars, kyunki frontend validation hai)
const users = [
  { username: 'user1', password: 'pass123' },
  { username: 'user2', password: 'pass456' },
  { username: 'user3', password: 'pass789' },
  { username: 'user4', password: 'pass012' },
  { username: 'user5', password: 'pass345' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.updateOne(
      { username: u.username.toLowerCase() },
      { $set: { password: hash } },
      { upsert: true }
    );
  }
  console.log('5 users seeded ✅');
  process.exit(0);
})();