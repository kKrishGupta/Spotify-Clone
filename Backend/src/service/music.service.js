const musicModel = require("../models/music.model");
const { fetchJamendoSongs } = require("./jamendo.service");
const { fetchIndianSongs } = require("./indianMusic.service"); // 🔥 NEW (YouTube based)

// 🔀 Fisher–Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 🧹 Remove duplicates
const uniqueById = (songs) => {
  const seen = new Set();
  return songs.filter((song) => {
    const id = song?.id || song?._id?.toString();
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

// 🔧 Normalize ALL sources
const normalizeSong = (song) => ({
  id: song._id?.toString() || song.id,

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
    song.thumbnail ||     // 🔥 YouTube
    song.image ||         // 🔥 Jamendo
    song.album?.cover_medium ||
    "https://via.placeholder.com/150",

  uri:
    song.uri ||
    song.audio ||         // 🔥 Jamendo
    song.preview ||
    null,

  plays: song.plays || 0,
  likes: song.likes || 0,
});

// 🎯 SMART MIX (NOT PURE RANDOM)
const mixSongs = (db, indian, global) => {
  return [
    ...db.slice(0, 20),       // 🥇 Your DB songs
    ...indian.slice(0, 20),   // 🥈 Indian (YouTube)
    ...global.slice(0, 10),   // 🥉 Jamendo
  ];
};

// 🔥 FINAL HYBRID SYSTEM
const getHybridSongs = async () => {
  // ✅ 1. DB Songs
  const dbSongs = await musicModel
    .find({ status: "approved" })
    .populate("artist", "username")
    .lean();

  console.log("DB Songs:", dbSongs.length);

  // ✅ 2. External APIs (safe but visible)
  let jamendoSongs = [];
  let indianSongs = [];

  try {
    jamendoSongs = await fetchJamendoSongs();
    console.log("Jamendo:", jamendoSongs.length);
  } catch (e) {
    console.log("Jamendo failed:", e.message);
  }

  try {
    indianSongs = await fetchIndianSongs();
    console.log("Indian (YouTube):", indianSongs.length);
  } catch (e) {
    console.log("Indian fetch failed:", e.message);
  }

  // ✅ 3. Normalize
  const normalizedDB = dbSongs.map(normalizeSong);
  const normalizedJamendo = jamendoSongs.map(normalizeSong);
  const normalizedIndian = indianSongs.map(normalizeSong);

  // 🔥 4. Remove duplicates BEFORE mix
  const cleanDB = uniqueById(normalizedDB);
  const cleanIndian = uniqueById(normalizedIndian);
  const cleanJamendo = uniqueById(normalizedJamendo);

  // 🔥 5. Smart mix (NOT random chaos)
  let finalSongs = mixSongs(cleanDB, cleanIndian, cleanJamendo);

  // 🔀 6. Light shuffle (not destructive)
  finalSongs = shuffle(finalSongs);

  // 🔥 7. Final dedupe + limit
  finalSongs = uniqueById(finalSongs).slice(0, 50);

  console.log("Final songs:", finalSongs.length);

  return finalSongs;
};

module.exports = { getHybridSongs };