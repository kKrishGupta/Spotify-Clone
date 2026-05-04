const axios = require("axios");

const fetchIndianSongs = async () => {
  try {
    const res = await axios.get(
  "https://api.deezer.com/chart/0/tracks",
  {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  }
);

    return res.data.data.map((song) => ({
      id: `ind-${song.id}`,
      title: song.title,
      artist: song.artist.name,
      cover: song.album.cover_medium,
      uri: song.preview,
      source: "deezer-chart",
    }));

  } catch (err) {
    console.log("❌ Deezer failed:", err.message);
    return [];
  }
};

module.exports = { fetchIndianSongs };