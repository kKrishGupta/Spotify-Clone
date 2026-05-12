const emitFeedUpdate =
  (
    io,
    userId,
    payload
  ) => {

    io.to(
      `user:${userId}`
    ).emit(
      "feed:update",
      payload
    );
  };

module.exports = {
  emitFeedUpdate,
};