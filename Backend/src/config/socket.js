const logger = require("./logger");

let socketio = null;
let io = null;

try {
  socketio = require("socket.io");
} catch (err) {
  logger.warn({
    message: "socket.io is not installed; realtime events will be no-op",
  });
}

const createNoopSocket = () => ({
  emit: () => false,
  to: () => ({
    emit: () => false,
  }),
});

const initializeSocket = (server) => {
  if (!socketio) {
    io = createNoopSocket();
    return io;
  }

  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info({
      message: "Socket connected",
      socketId: socket.id,
    });

    socket.on("user:join", (userId) => {
      if (userId) {
        socket.join(userId.toString());
      }
    });

    socket.on("disconnect", () => {
      logger.info({
        message: "Socket disconnected",
        socketId: socket.id,
      });
    });
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};
