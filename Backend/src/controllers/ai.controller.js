const aiService = require("../service/ai.service");
const { success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");
const notificationService =
  require("../service/notification.service");

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const reply = await aiService.generateReply(req.user.id, message);

  // 🔔 AI RECOMMENDATION ALERT
await notificationService.sendNotification({
  user: req.user.id,

  type: "system",

  title: "AI Picks Ready",

  message:
    "New Punjabi gym songs recommended for you",
});

  return success(res, { reply }, "AI response generated");
});

module.exports = { chat };
