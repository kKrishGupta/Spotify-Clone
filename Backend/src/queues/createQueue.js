const { Queue } = require(
  "bullmq"
);

const {
  createBullMQConnection,
} = require(
  "../config/bullmq"
);

const createQueue = (
  name,
  connectionName,
  defaultJobOptions = {}
) => {

  let queue = null;

  const timeoutMs = Number(
    process.env
      .QUEUE_ADD_TIMEOUT_MS ||
      2500
  );

  /* =========================================
     🚀 GET QUEUE INSTANCE
  ========================================= */

  const getQueue = () => {

    if (!queue) {

      queue = new Queue(
        name,
        {
          connection:
            createBullMQConnection(
              connectionName
            ),

          defaultJobOptions: {

            /* =================================
               🔁 RETRY SYSTEM
            ================================= */

            attempts: 5,

            backoff: {
              type:
                "exponential",

              delay: 2000,
            },

            /* =================================
               🧹 AUTO CLEANUP
            ================================= */

            removeOnComplete:
              1000,

            removeOnFail:
              5000,

            /* =================================
               ⚙ CUSTOM OVERRIDES
            ================================= */

            ...defaultJobOptions,
          },
        }
      );
    }

    return queue;
  };

  /* =========================================
     ➕ ADD JOB
  ========================================= */

  const add = (...args) =>
    new Promise(
      (
        resolve,
        reject
      ) => {

        const timer =
          setTimeout(
            () =>
              reject(
                new Error(
                  `Queue add timed out for ${name}`
                )
              ),
            timeoutMs
          );

        getQueue()
          .add(...args)

          .then((job) => {

            clearTimeout(
              timer
            );

            resolve(job);
          })

          .catch((err) => {

            clearTimeout(
              timer
            );

            reject(err);
          });
      }
    );

  /* =========================================
     ❌ CLOSE QUEUE
  ========================================= */

  const close = async () => {

    if (queue) {

      await queue.close();
    }
  };

  return {
    add,
    close,
    getQueue,
  };
};

module.exports =
  createQueue;