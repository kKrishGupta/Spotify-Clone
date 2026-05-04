const { generateResponse } = require("../ai/ai.service");
const { buildPrompt } = require("../ai/prompt.builder");

const userRepo = require("../repositories/user.repository");
const activityRepo = require("../repositories/activity.repository");

const generateReply = async (userId, message) => {

  // SAME AS BEFORE (moved to service)
  const user = await userRepo.findById(userId);
  const history = await activityRepo.findByUser(userId);

  // SAME LOGIC
  const prompt = buildPrompt(user, history, message);

  const reply = await generateResponse(prompt);

  // 🔥 IMPORTANT: preserving functionality + improving system
  await activityRepo.create({
    user: userId,
    message,
    reply
  });

  return reply;
};

module.exports = {
  generateReply
};