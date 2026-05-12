const redis =
  require("../config/redis");

const ONLINE_PREFIX =
  "presence:user:";

const setUserOnline =
  async (
    userId,
    socketId
  ) => {

    await redis.client.set(
      `${ONLINE_PREFIX}${userId}`,

      JSON.stringify({
        socketId,
        online: true,
        lastSeen:
          Date.now(),
      }),

      {
        EX: 300,
      }
    );
  };

const setUserOffline =
  async (userId) => {

    await redis.client.del(
      `${ONLINE_PREFIX}${userId}`
    );
  };

const getUserPresence =
  async (userId) => {

    const data =
      await redis.client.get(
        `${ONLINE_PREFIX}${userId}`
      );

    if (!data) {
      return {
        online: false,
      };
    }

    return JSON.parse(data);
  };

module.exports = {
  setUserOnline,
  setUserOffline,
  getUserPresence,
};