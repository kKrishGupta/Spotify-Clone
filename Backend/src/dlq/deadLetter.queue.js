const createQueue =
  require(
    "../queues/createQueue"
  );

module.exports =
  createQueue(
    "dead-letter",
    "dead-letter-queue"
  );