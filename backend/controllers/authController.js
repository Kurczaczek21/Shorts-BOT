const User = require("../MongoDB/userModel");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({message: "User created."});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = signup;