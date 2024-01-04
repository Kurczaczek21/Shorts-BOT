const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Dotenv = require("dotenv-webpack");
const { chatWithOpenAI } = require("./chatGPT_API");
const User = require("./backend/MongoDB/userModel");
const jwt = require('jsonwebtoken');


const connectDB = require("./backend/MongoDB/connectDB");
const loggedInRouter = require("./backend/routes/loggedInRoute");
const authRoutes = require("./backend/MongoDB/auth");
const registerRoutes = require("./backend/MongoDB/register");

module.exports = {
  // Konfiguracja webpack
  plugins: [new Dotenv()],
};

const port = process.env.PORT;

connectDB();

app.use(cors());

app.use(express.json());

// Login & Register
app.use("/login", authRoutes);
app.use("/register", registerRoutes);
app.get("/logged-in", authenticateToken, (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname + "/UI/after-login.html");
});

app.use(express.static(__dirname + "/UI"));

app.get("/", (req, res) => {
  res.send("Welcome to the server!!!");
});

app.get("/chat", async (req, res) => {
  const prompt =
    "Generate general idea and scenario in 3 steps for a motivational 15s YouTube Short";

  try {
    const response = await chatWithOpenAI(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas rozmowy z OpenAI." });
  }
});

app.post("/chat1", async (req, res) => {
  console.log(req.body.prompt);
  const prompt = req.body.prompt;

  try {
    const response = await chatWithOpenAI(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas rozmowy z OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/UI/home-page.html");
});

// tests
app.get("/tests", authenticateToken, (req, res) => {
  res.json("Nice");
});

app.post("/test-login", async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  const id = user._id
  console.log(id);
  const accessToken = jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  console.log(authHeader)
  const token = authHeader // && authHeader.split(' ')[1]
  console.log("TOken: " + token)
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(418)
    req.user = user
    next()
  })
}