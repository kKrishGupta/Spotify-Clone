const axios = require("axios");

const fetchJamendoSongs = async () => {
  try {
    const res = await axios.get(`https://api.jamendo.com/v3.0/tracks`, {
  params: {
    client_id: process.env.JAMENDO_CLIENT_ID,
    format: "json",
    limit: 50,
  },
});

    return res.data.results.map(track => ({
      id: `jam-${track.id}`,
      title: track.name,
      artist: track.artist_name,
      uri: track.audio,
      cover: track.image,
      source: "jamendo",
    }));
  } catch (error) {
    return [];
  }
};

module.exports = { fetchJamendoSongs };