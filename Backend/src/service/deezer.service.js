const axios = require("axios");

const fetchDeezerSongs = async () => {
  try {
    const res = await axios.get(
      "https://api.deezer.com/chart/0/tracks"
    );

    return res.data.data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      uri: track.preview,
      cover: track.album.cover_medium,
      source: "api",
      plays: track.rank,
      likes: 0
    }));

  } catch (err) {
    console.error("Deezer error:", err.message);
    return [];
  }
};

module.exports = { fetchDeezerSongs };