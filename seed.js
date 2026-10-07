require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const users = [
  { username: 'validuser', password: 'Test@123' },
  { username: 'user2', password: 'pass456' },
  { username: 'user3', password: 'pass789' },
  { username: 'user4', password: 'pass012' },
  { username: 'user5', password: 'pass345' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({}); // purane user1..5 hat jaayenge, sirf ye 5 rahenge
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username.toLowerCase(), password: hash });
  }
  console.log('5 users seeded ✅');
  process.exit(0);
})();