// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./userModel');
const generateToken = require('./generateToken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      console.log("User found")
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log("Password matched")
        // Redirect to /logged-in
        res.json({ 
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
        // res.redirect('/logged-in');
      } else {
        res.status(401).send('Invalid password');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).send('Error logging in');
  }
});

module.exports = router;
