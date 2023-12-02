const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Dotenv = require("dotenv-webpack");
const { chatWithOpenAI } = require("./chatGPT_API");

module.exports = {
  // Konfiguracja webpack
  plugins: [new Dotenv()],
};

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

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

app.use(express.static("UI"));

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/UI/home-page.html");
});

app.get("/logged-in", (req, res) => {
  res.sendFile(__dirname + "/UI/after-login.html");
});
