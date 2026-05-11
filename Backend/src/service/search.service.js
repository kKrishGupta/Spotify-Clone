const musicModel = require("../models/music.model");

const {
  fetchIndianSongs,
} = require("./indianMusic.service");

const {
  fetchJamendoSongs,
} = require("./jamendo.service");

const {
  fetchIndianSongs:
    fetchDeezerSongs,
} = require("./deezer.service");

// 🔀 Remove duplicates
const uniqueById = (songs) => {
  const seen = new Set();

  return songs.filter((song) => {
    const id =
      song?.id ||
      song?._id?.toString();

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);

    return true;
  });
};

// 🔧 Normalize ALL sources
const normalizeSong = (
  song
) => ({
  id:
    song._id?.toString() ||
    song.id,

  title:
    song.title ||
    song.name ||
    "Unknown Title",

  artist:
    song.artist?.username ||
    song.artist?.name ||
    song.artist_name ||
    song.artist ||
    "Unknown Artist",

  cover:
    song.cover ||
    song.thumbnail ||
    song.image ||
    song.album?.cover_medium ||
    "https://via.placeholder.com/300",

  uri:
    song.uri ||
    song.audio ||
    song.preview ||
    null,

  genre:
    song.genre ||
    "Unknown",

  plays:
    song.plays || 0,

  likes:
    song.likes || 0,

  source:
    song.source ||
    "upload",
});

// 🔍 HYBRID SEARCH ENGINE
const searchSongs = async (
  query,
  page = 1,
  limit = 20
) => {
  const skip =
    (page - 1) * limit;

  // ✅ DATABASE SEARCH
  let dbSongs = [];

  try {
    dbSongs =
      await musicModel
        .find({
          $or: [
            {
              title: {
                $regex:
                  query,
                $options:
                  "i",
              },
            },

            {
              genre: {
                $regex:
                  query,
                $options:
                  "i",
              },
            },

            {
              tags: {
                $regex:
                  query,
                $options:
                  "i",
              },
            },
          ],

          status:
            "approved",
        })
        .populate(
          "artist",
          "username"
        )
        .lean();

    console.log(
      "DB Search:",
      dbSongs.length
    );
  } catch (err) {
    console.log(
      "DB search failed:",
      err.message
    );
  }

  // ✅ YOUTUBE SEARCH
  let ytSongs = [];

  try {
    ytSongs =
      await fetchIndianSongs();

    console.log(
      "YT Songs:",
      ytSongs.length
    );
  } catch (err) {
    console.log(
      "YT search failed:",
      err.message
    );
  }

  // ✅ JAMENDO SEARCH
  let jamendoSongs = [];

  try {
    jamendoSongs =
      await fetchJamendoSongs();

    console.log(
      "Jamendo Songs:",
      jamendoSongs.length
    );
  } catch (err) {
    console.log(
      "Jamendo search failed:",
      err.message
    );
  }

  // ✅ DEEZER SEARCH
  let deezerSongs = [];

  try {
    deezerSongs =
      await fetchDeezerSongs();

    console.log(
      "Deezer Songs:",
      deezerSongs.length
    );
  } catch (err) {
    console.log(
      "Deezer search failed:",
      err.message
    );
  }

  // 🔥 COMBINE ALL SOURCES
  const allSongs = [
    ...dbSongs,
    ...ytSongs,
    ...jamendoSongs,
    ...deezerSongs,
  ];

  // 🔥 FILTER BASED ON QUERY
  const filteredSongs =
    allSongs.filter((song) => {
      const title =
        (
          song.title ||
          song.name ||
          ""
        ).toLowerCase();

      const artist =
        (
          song.artist
            ?.username ||
          song.artist
            ?.name ||
          song.artist_name ||
          song.artist ||
          ""
        ).toLowerCase();

      const genre =
        (
          song.genre || ""
        ).toLowerCase();

      const q =
        query.toLowerCase();

      return (
        title.includes(q) ||
        artist.includes(q) ||
        genre.includes(q)
      );
    });

  // 🔥 NORMALIZE
  const normalizedSongs =
    filteredSongs.map(
      normalizeSong
    );

  // 🔥 REMOVE DUPLICATES
  const uniqueSongs =
    uniqueById(
      normalizedSongs
    );

  // 🔥 PAGINATION
  const paginatedSongs =
    uniqueSongs.slice(
      skip,
      skip + limit
    );

  console.log(
    "Final Search Results:",
    paginatedSongs.length
  );

  return {
    total:
      uniqueSongs.length,

    currentPage: page,

    totalPages:
      Math.ceil(
        uniqueSongs.length /
          limit
      ),

    songs:
      paginatedSongs,
  };
};

module.exports = {
  searchSongs,
};