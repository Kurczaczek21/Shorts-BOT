const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Dotenv = require("dotenv-webpack");
const { chatWithOpenAI } = require("./chatGPT_API");
const { generateVideo } = require("./web_scrape");

module.exports = {
  // Konfiguracja webpack
  plugins: [new Dotenv()],
};

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

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

app.post("/modify", async (req, res) => {
  console.log(req.body.prompt);
  const prompt = req.body.prompt;

  try {
    const input_info = `
      UWAGA w odpwiedzi mozesz zawrzec maksymalnie jeden film.
      Scenariusz MUSI być w formie:
      Pirwsza linia - tytuł
      Każda kolejna linia- sam tekst wyświetlany na konkretnej scenie

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
        ]
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/logged-in`);
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/UI/home-page.html");
});

app.get("/logged-in", (req, res) => {
  res.sendFile(__dirname + "/UI/after-login.html");
});
