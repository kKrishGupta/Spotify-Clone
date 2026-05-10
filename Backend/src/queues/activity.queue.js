const createQueue = require("./createQueue");
const QUEUES = require("../constants/queues");

module.exports = createQueue(QUEUES.ACTIVITY, "activity-queue", {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: 1000,
  removeOnFail: 5000,
});
