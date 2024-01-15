const User = require("../MongoDB/userModel");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created." });
  } catch (error) {
    // next(error);
    next(errorHandler(300, "cos"));
  }
};

module.exports = signup;
