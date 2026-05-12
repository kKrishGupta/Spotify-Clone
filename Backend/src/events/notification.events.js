const emitNotification =
  (
    io,
    userId,
    payload
  ) => {

    io.to(
      `user:${userId}`
    ).emit(
      "notification:new",
      payload
    );
  };

module.exports = {
  emitNotification,
};