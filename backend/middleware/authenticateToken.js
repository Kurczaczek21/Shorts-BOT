const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing Token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid Token' });
    }

    // Dodaj informacje o użytkowniku do obiektu req, aby inne middleware lub obsługa żądań mogły z nich korzystać
    req.user = user;

    next();
  });
};
module.exports = authenticateToken;