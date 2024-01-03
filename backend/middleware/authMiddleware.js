// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../MongoDB/userModel.js");
require("dotenv").config();

async function verifyToken(req, res, next) {
  let token;

  if (req.headers.authorization) {
    try {
      token = req.headers.authorization;

      // decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}

module.exports = verifyToken;
