const musicModel = require("../models/music.model");
const { fetchJamendoSongs } = require("./jamendo.service");
const { fetchDeezerSongs } = require("./deezer.service");


const getHybridSongs = async () => {
  const dbSongs = await musicModel.find({status: "approved"});
  const [jamendoSongs, deezerSongs] = await Promise.all([
    fetchJamendoSongs(),
    fetchDeezerSongs()
  ]);

  return [...dbSongs, ...jamendoSongs, ...deezerSongs];
};

module.exports = { getHybridSongs };
