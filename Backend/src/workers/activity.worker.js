const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const activityModel = require("../models/activity.model");

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "activityQueue",
  async (job) => {
    const { user, song, action } = job.data;

    await activityModel.create({
      user,
      song,
      action,
    });

    console.log("✅ Activity saved:", action);
  },
  { connection }
);

worker.on("completed", () => {
  console.log("🎉 Job completed");
});

worker.on("failed", (job, err) => {
  console.error("❌ Job failed:", err.message);
});