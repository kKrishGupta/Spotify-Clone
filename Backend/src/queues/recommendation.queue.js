const createQueue = require("./createQueue");
const QUEUES = require("../constants/queues");

module.exports = createQueue(QUEUES.RECOMMENDATIONS, "recommendation-queue", {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
  removeOnComplete: 1000,
  removeOnFail: 3000,
});
