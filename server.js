const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Dotenv = require("dotenv-webpack");
const { chatWithOpenAI } = require("./chatGPT_API");
const { generateVideo } = require("./web_scrape");
const User = require("./backend/MongoDB/userModel");
const jwt = require("jsonwebtoken");

const connectDB = require("./backend/MongoDB/connectDB");
const loggedInRouter = require("./backend/routes/loggedInRoute");
const authRoutes = require("./backend/MongoDB/auth");
const registerRoutes = require("./backend/MongoDB/register");
const { processVideo } = require('./insta_upload_v2/mainProcessor');


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
app.get("/logged-in", (req, res) => {
  res.sendFile(__dirname + "/UI/after-login.html");
});

app.use(express.static(__dirname + "/UI"));

app.get("/", (req, res) => {
  res.send("Welcome to the server!!!");
});

app.get("/chat", authenticateToken, async (req, res) => {
  const prompt =
    "Napisz 5 zdań, kompletnie niezależnych od siebie w numerowanej liście";

  try {
    const response = await chatWithOpenAI(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas rozmowy z OpenAI." });
  }
});

app.post("/chat1", authenticateToken, async (req, res) => {
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

app.post("/modify", async (req, res) => {
  console.log(req.body.prompt);
  const prompt = req.body.prompt;

  try {
    const input_info = `
      UWAGA w odpwiedzi mozesz zawrzec maksymalnie jeden film.
      Scenariusz MUSI być w formie:
      Pirwsza linia - tytuł
      Każda kolejna linia- sam tekst wyświetlany na konkretnej scenie, BEZ KROPKI NA KOŃCU

      W odpowiedzi napisz mi tylko tytuł oraz tekst wyświetlany na konkretnych scenach. Bez opisu scenerii. Bez numerow scen. Sam tekst który będzie wyświetlany na filmie. Nie pisz
      Tytuł: , Scena 1: i tak dalej. Napisz sam tekst wyświetlany na filmie.

      Odpowiedź zwróc w formie pliku JSON.
      Tak powinna wygladac
      {
        "title": "TYTUL FILMU",
        "scenes": [
          "TEKST wyswetlanyna scenie 1",
          "TEKST wyswetlanyna scenie 2",
          "TEKST wyswetlanyna scenie 3",
          "TESKT wyswetilani na koncu filmu"
        ],
        "description": "krótki opis filmu i 3 tagi każdy po znaku #"
      };  
      Oczywiscie scen moze byc wiecej.
      `;
    console.log(prompt + input_info);
    const response = await chatWithOpenAI(prompt + input_info);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas rozmowy z OpenAI." });
  }
});

app.post("/genvid", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await generateVideo(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd." });
  }
});

app.post("/upload", async (req, res) => {
  const data = req.body;

  try {
    console.log(data);
    console.log(data.url);
    console.log(data.caption);
    const response = await processVideo(data.url, data.caption, process.env.ACCESS_TOKEN, process.env.IG_USER_ID);
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/logged-in`);
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
  const id = user._id;
  console.log(id);
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("TOken: " + token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(418);
    req.user = user;
    next();
  });
}
