// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;
