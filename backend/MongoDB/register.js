// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./userModel');
const generateToken = require('./generateToken');

const router = express.Router();

// Register a new user
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword
  });

  if(user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
  });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

module.exports = router;
