const emitNotification = (
  io,
  userId,
  payload
) => {
  io.to(userId).emit(
    "notification",
    payload
  );
};

module.exports = {
  emitNotification,
};