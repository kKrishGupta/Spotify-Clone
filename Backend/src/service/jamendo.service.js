const axios = require('axios');
const fetchJamendoSongs = async () => {
  try{
    const res = await axios.get(`https://api.jamendo.com/v3.0/tracks`,{
      params:{
        client_id: process.env.JAMENDO_CLIENT_ID,
        format: "json",
        limit: 10,
      }
    });

    return res.data.results.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      uri: track.audio,
      cover: track.image,
      source: "api",
      plays: 0,
      likes: 0
    }));
  } catch (error) {
    console.error("Error fetching Jamendo data:", error);
    throw error;
  }
};

module.exports = {
  fetchJamendoSongs
}