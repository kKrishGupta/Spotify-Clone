const Groq = require("groq-sdk");
const AppError = require("../utils/AppError");

let client;

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError("AI provider is not configured", 503);
  }

  if (!client) {
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return client;
};

const generateResponse = async (prompt) => {
  const res = await getClient().chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a helpful AI music assistant." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
};

module.exports = { generateResponse };
