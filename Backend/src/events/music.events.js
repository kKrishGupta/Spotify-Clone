const emitSongPlayed = (
  io,
  payload
) => {
  io.emit("song:played", payload);
};

const emitSongLiked = (
  io,
  payload
) => {
  io.emit("song:liked", payload);
};

module.exports = {
  emitSongPlayed,
  emitSongLiked,
};