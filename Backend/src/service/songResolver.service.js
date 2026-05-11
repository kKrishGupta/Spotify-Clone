const musicModel =
  require(
    "../models/music.model"
  );

const ExternalSong =
  require(
    "../models/externalSong.model"
  );

const {
  getHybridSongs,
} = require(
  "./music.service"
);

const resolveSongData =
  async (songId) => {

    // ✅ MONGODB SONG
    if (
      songId.match(
        /^[0-9a-fA-F]{24}$/
      )
    ) {
      const song =
        await musicModel
          .findById(songId)
          .populate(
            "artist",
            "username"
          );

      if (!song)
        return null;

      return {
        songId:
          song._id.toString(),

        source:
          "upload",

        title:
          song.title,

        artist:
          song.artist
            ?.username ||
          "Unknown",

        cover:
          song.thumbnail,

        uri:
          song.uri,
      };
    }

    // ✅ CHECK CACHED EXTERNAL SONG
    const external =
      await ExternalSong.findOne(
        {
          externalId:
            songId,
        }
      );

    if (external) {
      return {
        songId:
          external.externalId,

        source:
          external.source,

        title:
          external.title,

        artist:
          external.artist,

        cover:
          external.cover,

        uri:
          external.uri,
      };
    }

    // 🚀 HYBRID RUNTIME SEARCH
    const hybridSongs =
      await getHybridSongs();

    const foundSong =
      hybridSongs.find(
        (song) =>
          song.id ===
          songId
      );

    if (!foundSong)
      return null;

    // 🔥 CACHE INTO DB
    await ExternalSong.create(
      {
        externalId:
          foundSong.id,

        title:
          foundSong.title,

        artist:
          foundSong.artist,

        cover:
          foundSong.cover,

        uri:
          foundSong.uri,

        source:
          foundSong.source,

        plays: 0,

        likes: 0,
      }
    );

    return {
      songId:
        foundSong.id,

      source:
        foundSong.source,

      title:
        foundSong.title,

      artist:
        foundSong.artist,

      cover:
        foundSong.cover,

      uri:
        foundSong.uri,
    };
  };

module.exports = {
  resolveSongData,
};