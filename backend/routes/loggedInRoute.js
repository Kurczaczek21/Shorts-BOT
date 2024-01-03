// routes/loggedInRoute.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.sendFile(__dirname + '../../UI/after-login.html');
});

module.exports = router;
