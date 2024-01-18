const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    // return res.status(401).json({ message: 'Unauthorized: Missing Token' });
    return res.redirect("../../unauthorized.html");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }
    next();
  });
};
module.exports = authenticateToken;
