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

const {
  getSearchCache,
  setSearchCache,
} = require("../cache/search.cache");

/* =========================================
   🚀 REMOVE DUPLICATES
========================================= */

const uniqueById = (
  songs
) => {

  const seen =
    new Set();

  return songs.filter(
    (song) => {

      const id =
        song?.id ||
        song?._id?.toString();

      if (
        !id ||
        seen.has(id)
      ) {
        return false;
      }

      seen.add(id);

      return true;
    }
  );
};

/* =========================================
   🚀 NORMALIZE QUERY
========================================= */

const normalizeQuery =
  (
    query = ""
  ) =>
    query
      .toLowerCase()
      .trim();

/* =========================================
   🚀 NORMALIZE SONG
========================================= */

const normalizeSong =
  (song) => ({

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
      song.album
        ?.cover_medium ||
      "https://via.placeholder.com/300",

    uri:
      song.uri ||
      song.audio ||
      song.preview ||
      null,

    genre:
      song.genre ||
      "Unknown",

    mood:
      song.mood || [],

    tags:
      song.tags || [],

    plays:
      song.plays || 0,

    likes:
      song.likes || 0,

    source:
      song.source ||
      "upload",
  });

/* =========================================
   🚀 SEARCH SCORING ENGINE
========================================= */

const calculateScore =
  (
    song,
    query
  ) => {

    const normalized =
      normalizeQuery(
        query
      );

    let score = 0;

    const title =
      (
        song.title || ""
      ).toLowerCase();

    const artist =
      (
        song.artist || ""
      ).toLowerCase();

    const genre =
      (
        song.genre || ""
      ).toLowerCase();

    // 🚀 TITLE MATCH
    if (
      title.includes(
        normalized
      )
    ) {
      score += 100;
    }

    // 🚀 ARTIST MATCH
    if (
      artist.includes(
        normalized
      )
    ) {
      score += 70;
    }

    // 🚀 GENRE MATCH
    if (
      genre.includes(
        normalized
      )
    ) {
      score += 40;
    }

    // 🚀 POPULARITY
    score +=
      (song.plays || 0) *
      0.1;

    // 🚀 ENGAGEMENT
    score +=
      (song.likes || 0) *
      2;

    // 🚀 BOOST LOCAL SONGS
    if (
      song.source ===
      "upload"
    ) {
      score += 20;
    }

    return score;
  };

/* =========================================
   🚀 HYBRID AI SEARCH ENGINE
========================================= */

const searchSongs =
  async (
    query,
    page = 1,
    limit = 20
  ) => {

    const normalizedQuery =
      normalizeQuery(
        query
      );

    const skip =
      (page - 1) * limit;

    const cacheKey =
      `search:${normalizedQuery}:${page}:${limit}`;

    /* =====================================
       🚀 CACHE CHECK
    ===================================== */

    try {

      const cached =
        await getSearchCache(
          cacheKey
        );

      if (cached) {

        console.log(
          "⚡ Search cache hit"
        );

        return cached;
      }

    } catch (err) {

      console.log(
        "Search cache read failed:",
        err.message
      );
    }

    /* =====================================
       🚀 DATABASE SEARCH
    ===================================== */

    let dbSongs = [];

    try {

      dbSongs =
        await musicModel
          .find({
            status:
              "approved",

            $or: [
              {
                title: {
                  $regex:
                    normalizedQuery,

                  $options:
                    "i",
                },
              },

              {
                genre: {
                  $regex:
                    normalizedQuery,

                  $options:
                    "i",
                },
              },

              {
                tags: {
                  $regex:
                    normalizedQuery,

                  $options:
                    "i",
                },
              },

              {
                mood: {
                  $regex:
                    normalizedQuery,

                  $options:
                    "i",
                },
              },
            ],
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

    /* =====================================
       🚀 YOUTUBE SONGS
    ===================================== */

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

    /* =====================================
       🚀 JAMENDO SONGS
    ===================================== */

    let jamendoSongs =
      [];

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

    /* =====================================
       🚀 DEEZER SONGS
    ===================================== */

    let deezerSongs =
      [];

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

    /* =====================================
       🚀 COMBINE ALL SOURCES
    ===================================== */

    const allSongs = [
      ...dbSongs,
      ...ytSongs,
      ...jamendoSongs,
      ...deezerSongs,
    ];

    /* =====================================
       🚀 FILTER SONGS
    ===================================== */

    const filteredSongs =
      allSongs.filter(
        (song) => {

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
              song.genre ||
              ""
            ).toLowerCase();

          const tags =
            (
              song.tags || []
            )
              .join(" ")
              .toLowerCase();

          const mood =
            (
              song.mood || []
            )
              .join(" ")
              .toLowerCase();

          return (
            title.includes(
              normalizedQuery
            ) ||

            artist.includes(
              normalizedQuery
            ) ||

            genre.includes(
              normalizedQuery
            ) ||

            tags.includes(
              normalizedQuery
            ) ||

            mood.includes(
              normalizedQuery
            )
          );
        }
      );

    /* =====================================
       🚀 NORMALIZE
    ===================================== */

    let normalizedSongs =
      filteredSongs.map(
        normalizeSong
      );

    /* =====================================
       🚀 REMOVE DUPLICATES
    ===================================== */

    normalizedSongs =
      uniqueById(
        normalizedSongs
      );

    /* =====================================
       🚀 AI RANKING
    ===================================== */

    normalizedSongs.sort(
      (a, b) => {

        const scoreA =
          calculateScore(
            a,
            normalizedQuery
          );

        const scoreB =
          calculateScore(
            b,
            normalizedQuery
          );

        return (
          scoreB -
          scoreA
        );
      }
    );

    /* =====================================
       🚀 PAGINATION
    ===================================== */

    const paginatedSongs =
      normalizedSongs.slice(
        skip,
        skip + limit
      );

    /* =====================================
       🚀 FINAL RESULT
    ===================================== */

    const result = {

      total:
        normalizedSongs.length,

      currentPage:
        page,

      totalPages:
        Math.ceil(
          normalizedSongs.length /
            limit
        ),

      songs:
        paginatedSongs,
    };

    /* =====================================
       🚀 CACHE RESULT
    ===================================== */

    try {

      await setSearchCache(
        cacheKey,
        result
      );

    } catch (err) {

      console.log(
        "Search cache set failed:",
        err.message
      );
    }

    console.log(
      "Final Search Results:",
      paginatedSongs.length
    );

    return result;
  };

module.exports = {
  searchSongs,
};