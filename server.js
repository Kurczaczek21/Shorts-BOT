const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // Konfiguracja webpack
  plugins: [
    new Dotenv()
  ]
};

const port = process.env.PORT;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the server!!!");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

app.use(express.static("UI"));

// Dodaj trasę obsługującą ścieżkę "/home"
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/UI/home-page.html");
});

app.get("/logged-in", (req, res) => {
  res.sendFile(__dirname + "/UI/after-login.html");
});
