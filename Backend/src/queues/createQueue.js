const { Queue } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");

const createQueue = (name, connectionName, defaultJobOptions = {}) => {
  let queue = null;
  const timeoutMs = Number(process.env.QUEUE_ADD_TIMEOUT_MS || 2500);

  const getQueue = () => {
    if (!queue) {
      queue = new Queue(name, {
        connection: createBullMQConnection(connectionName),
        defaultJobOptions,
      });
    }

    return queue;
  };

  return {
    add: (...args) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error(`Queue add timed out for ${name}`)),
          timeoutMs
        );

        getQueue()
          .add(...args)
          .then((job) => {
            clearTimeout(timer);
            resolve(job);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      }),
    close: async () => {
      if (queue) {
        await queue.close();
      }
    },
    getQueue,
  };
};

module.exports = createQueue;
