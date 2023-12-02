const axios = require("axios");
const { env } = require("process");

const apiKey = process.env.OPENAI_API_KEY;

async function chatWithOpenAI(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const choices = response.data.choices;
    const lastMessage = choices[choices.length - 1];
    return lastMessage.message.content;
  } catch (error) {
    console.error("Error during API call:", error.message);
    throw error;
  }
}

// Przykładowe użycie
const userPrompt =
  "Generate general idea and scenario in 3 steps for a motivational 15s YouTube Short";
chatWithOpenAI(userPrompt)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error("Błąd:", error.message);
  });

module.exports = { chatWithOpenAI };
