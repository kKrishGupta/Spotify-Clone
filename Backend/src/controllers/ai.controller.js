const aiService = require("../service/ai.service");
const { success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const reply = await aiService.generateReply(req.user.id, message);

  return success(res, { reply }, "AI response generated");
});

module.exports = { chat };
