const User = require("../MongoDB/userModel");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created." });
  } catch (error) {
    // next(error);
    next(errorHandler(409, "User already exists in the database"));
  }
};

const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Incorrect password"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // secret - random string for sec
    const { password: hashedPassword, ...restOfUser } = validUser._doc; // removing password from response
    res.setHeader("Cache-Control", "private");
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .status(200)
      .json(restOfUser); // httpOnly - true -> prevent 3rd party apps to modify cookie ez
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const checkLoginMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  try {
    if (accessToken) {
      res.status(200).json({ message: "User is logged in" });
    } else {
      console.log("user not logged in");
    }
  } catch (error) {
    next();
  }
};

module.exports = { signup, signin, signout, checkLoginMiddleware };
