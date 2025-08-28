const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/kingsmen-pastries', { useNewUrlParser: true, useUnifiedTopology: true });

async function hashPasswords() {
  const users = await User.find();
  for (const user of users) {
    // Check if password is already hashed (bcrypt hashes start with $2)
    if (!user.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log(`Hashed password for user: ${user.email}`);
    }
  }
  console.log('Done updating passwords.');
  mongoose.disconnect();
}

hashPasswords();