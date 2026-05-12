const emitSongPlayed =
  (io, payload) => {

    io.emit(
      "song:play",
      payload
    );
  };

const emitSongLiked =
  (io, payload) => {

    io.emit(
      "song:like",
      payload
    );
  };

const emitArtistUpload =
  (io, payload) => {

    io.to(
      `artist:${payload.artistId}`
    ).emit(
      "artist:upload",
      payload
    );
  };

module.exports = {
  emitSongPlayed,
  emitSongLiked,
  emitArtistUpload,
};