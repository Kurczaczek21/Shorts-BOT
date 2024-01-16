const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Dotenv = require("dotenv-webpack");
const { chatWithOpenAI } = require("./chatGPT_API");
const { generateVideo } = require("./web_scrape");
const connectDB = require("./backend/MongoDB/connectDB");
const authRoutes = require("./backend/routes/auth");
const { processVideo } = require("./insta_upload_v2/mainProcessor");

module.exports = {
  plugins: [new Dotenv()],
};

const port = process.env.PORT;
connectDB();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Login & Register
// app.use("/login", authRoutes);
app.use("/api/auth", authRoutes);

app.use(express.static(__dirname + "/UI"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/UI/home-page.html");
});

app.get("/panel", (req, res) => {
  res.sendFile(__dirname + "/UI/after-login.html");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.get("/chat", async (req, res) => {
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
      Każda kolejna linia- sam tekst wyświetlany na konkretnej scenie, BEZ KROPKI NA KOŃCU

      W odpowiedzi napisz mi tylko tytuł oraz tekst wyświetlany na konkretnych scenach. Bez opisu scenerii. Bez numerow scen. Sam tekst który będzie wyświetlany na filmie. Nie pisz
      Tytuł: , Scena 1: i tak dalej. Napisz sam tekst wyświetlany na filmie.

      Odpowiedź zwróc w formie pliku JSON.
      Tak powinna wygladac
      {
        "title": "TYTUL FILMU",
        "scenes": [
          "TEKST wyświetlany na scenie 1",
          "TEKST wyświetlany na scenie 2",
          "TEKST wyświetlany na scenie 3",
          "TESKT wyświetlany na koncu filmu"
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
  const data = req.body.data;

  try {
    console.log(data);
    console.log(data.url);
    console.log(data.caption);
    const response = await processVideo(
      data.url,
      data.caption,
      process.env.ACCESS_TOKEN,
      process.env.IG_USER_ID
    );
    res.json({ response });
  } catch (error) {
    console.error("Błąd:", error.message);
    res.status(500).json({ error: "Wystąpił błąd." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
