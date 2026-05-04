const aiService = require("../service/ai.service");

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await aiService.generateReply(req.user.id, message);

    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

module.exports = { chat };