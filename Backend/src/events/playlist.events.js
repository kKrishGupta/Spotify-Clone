const emitPlaylistUpdated =
  (
    io,
    playlistId,
    payload
  ) => {

    io.to(
      `playlist:${playlistId}`
    ).emit(
      "playlist:update",
      payload
    );
  };

module.exports = {
  emitPlaylistUpdated,
};