const { generateResponse } = require("../ai/ai.service");
const { buildPrompt } = require("../ai/prompt.builder");
const { detectMood } = require("../ai/mood.ai");
const { generateEmbedding } = require("../ai/embedding.service");
const { recommendSongs } = require("../ai/recommendation.ai");
const { upsertVector } = require("../ai/vector.service");
const userRepo = require("../repositories/user.repository");
const activityRepo = require("../repositories/activity.repository");
const analyticsQueue = require("../queues/analytics.queue");
const recommendationQueue = require("../queues/recommendation.queue");
const AppError = require("../utils/AppError");

const generateReply = async (userId, message) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const history = await activityRepo.findByUser(userId);
  const mood = await detectMood(message || "");
  const recommendationContext = await recommendSongs(user);
  const embedding = await generateEmbedding(message || "");

  await upsertVector("ai-history", `${userId}:${Date.now()}`, {
    user: userId,
    query: message,
    mood: mood.mood,
    embedding: embedding.embedding,
  });

  const prompt = buildPrompt({
    user,
    history,
    mood: mood.mood,
    language: user.preferences?.languages?.[0] || "Hindi",
    query: message,
    recommendations: recommendationContext.recommendations,
  });

  const reply = await generateResponse(prompt);

  await activityRepo.createActivity({
    user: userId,
    action: "ai_chat",
    metadata: {
      message,
      reply,
      mood: mood.mood,
    },
  });

  await analyticsQueue
    .add("ai_chat", {
      type: "ai_chat",
      value: 1,
      meta: {
        user: userId,
        mood: mood.mood,
      },
    })
    .catch(() => {});

  await recommendationQueue
    .add("refresh", {
      userId,
      mood: mood.mood,
    })
    .catch(() => {});

  return reply;
};

module.exports = {
  generateReply,
};
