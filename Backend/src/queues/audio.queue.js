const createQueue = require("./createQueue");
const QUEUES = require("../constants/queues");

module.exports = createQueue(QUEUES.AUDIO_PROCESSING, "audio-queue", {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000,
  },
  removeOnComplete: 500,
  removeOnFail: 2000,
});
