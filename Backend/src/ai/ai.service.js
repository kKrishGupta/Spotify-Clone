const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateResponse = async (prompt) => {
  const res = await client.chat.completions.create({
    model: "llama-3.1-8b-instant", // ⚡ super fast
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
};

module.exports = { generateResponse };