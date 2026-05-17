const logger =
  require("./logger");

const jwt = require("jsonwebtoken");
const {connectRedis} = require("./redis");
const redis = require("./redis");

const {
  setUserOnline,
  setUserOffline,} = require("../service/presence.service");

let socketio = null;

let io = null;

try {

  socketio =
    require("socket.io");

} catch (err) {

  logger.warn({
    message:
      "socket.io unavailable",
  });
}

/* =========================================
   🚀 ONLINE USERS
========================================= */

const onlineUsers =
  new Map();

/* =========================================
   🚫 NOOP SOCKET
========================================= */

const createNoopSocket =
  () => ({
    emit: () => false,

    to: () => ({
      emit: () => false,
    }),
  });

/* =========================================
   🚀 INITIALIZE SOCKET
========================================= */

const initializeSocket =
  async (server) => {

    if (!socketio) {

      io =
        createNoopSocket();

      return io;
    }

    io = socketio(server, {

      cors: {
        origin:
          process.env.CLIENT_URL,

        credentials: true,
      },

      transports: [
        "websocket",
      ],
    });

    /* =====================================
       🔐 SOCKET AUTH
    ===================================== */

    io.use(
      async (
        socket,
        next
      ) => {

        try {

          const token =
            socket.handshake
              .auth?.token;

          if (!token) {

            return next(
              new Error(
                "Unauthorized"
              )
            );
          }

          const decoded =
            jwt.verify(
              token,
              process.env
                .JWT_ACCESS_SECRET
            );

          socket.user =
            decoded;

          return next();

        } catch (err) {

          logger.warn({
            message:
              "Socket authentication failed",

            error:
              err.message,
          });

          return next(
            new Error(
              "Socket auth failed"
            )
          );
        }
      }
    );

    /* =====================================
       🔌 CONNECTION
    ===================================== */

    io.on(
      "connection",

      async (
        socket
      ) => {

        const userId =
          socket.user.id;

        /* =================================
           🚀 MEMORY PRESENCE
        ================================= */

        onlineUsers.set(
          userId,
          socket.id
        );

        /* =================================
           🚀 REDIS PRESENCE
        ================================= */
        await connectRedis();
        await redis.client.set(
          `online:${userId}`,

          "1",

          {
            EX: 60,
          }
        );

        /* =================================
           🚀 PRESENCE ENGINE
        ================================= */

        await setUserOnline(
          socket.user.id,
          socket.id
        );

        /* =================================
           👤 USER ROOM
        ================================= */

        socket.join(
          `user:${socket.user.id}`
        );

        /* =================================
           🚀 GENERIC JOIN ROOM
        ================================= */

        socket.on(
          "join",

          (
            roomId
          ) => {

            socket.join(
              roomId
            );

            logger.info({
              message:
                "User joined socket room",

              userId,

              roomId,
            });
          }
        );

        logger.info({
          message:
            "Realtime user connected",

          userId,
        });

        /* =================================
           🎵 LIVE LISTENING
        ================================= */

        socket.on(
          "music:listen",

          async (
            payload
          ) => {
            await connectRedis();
            await redis.client.set(
              `listening:${userId}`,

              JSON.stringify(
                payload
              ),

              {
                EX: 120,
              }
            );

            io.emit(
              "presence:listening",

              {
                userId,
                ...payload,
              }
            );
          }
        );

        /* =================================
           📀 PLAYLIST ROOM
        ================================= */

        socket.on(
          "join:playlist",

          (
            playlistId
          ) => {

            socket.join(
              `playlist:${playlistId}`
            );

            logger.info({
              message:
                "Joined playlist room",

              userId,

              playlistId,
            });
          }
        );

        /* =================================
           🎤 ARTIST ROOM
        ================================= */

        socket.on(
          "join:artist",

          (
            artistId
          ) => {

            socket.join(
              `artist:${artistId}`
            );

            logger.info({
              message:
                "Joined artist room",

              userId,

              artistId,
            });
          }
        );

        /* =================================
           🔔 NOTIFICATION ROOM
        ================================= */

        socket.on(
          "join:notifications",

          () => {

            socket.join(
              userId.toString()
            );

            logger.info({
              message:
                "Joined notification room",

              userId,
            });
          }
        );

        /* =================================
           ❌ DISCONNECT
        ================================= */

        socket.on(
          "disconnect",

          async () => {

            onlineUsers.delete(
              userId
            );
            
            await redis.client.del(
              `online:${userId}`
            );

            /* =============================
               🚀 PRESENCE OFFLINE
            ============================= */

            await setUserOffline(
              socket.user.id
            );

            logger.info({
              message:
                "Realtime user disconnected",

              userId,
            });
          }
        );
      }
    );

    return io;
  };

/* =========================================
   📡 GET IO
========================================= */

const getIO =
  () => io;

/* =========================================
   🟢 ONLINE STATUS
========================================= */

const isUserOnline =
  (userId) =>
    onlineUsers.has(
      userId
    );

module.exports = {
  initializeSocket,
  getIO,
  isUserOnline,
};