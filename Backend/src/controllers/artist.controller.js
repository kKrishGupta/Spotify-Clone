const asyncHandler = require("../utils/asyncHandler");
const musicModel = require("../models/music.model");

const getArtistDashboard = asyncHandler (async(req,res)=>{
  const artistId = req.user.id;
  const songs = await musicModel.find({artist:artistId});
  const totalSongs = songs.length;

  const totalPlays = songs.reduce((acc, song) => acc + song.plays, 0);
  const totalLikes = songs.reduce((acc, song) => acc + song.likes, 0);

  res.status(200).json({
    success: true,
    data: {
      totalSongs,
      totalPlays,
      totalLikes,
      songs
    }
  });
});

const getArtistSongs = asyncHandler(async(req,res)=>{
  const songs = await musicModel.fid({artist:req.user.id});
    res.status(200).json({
    success: true,
    songs
  });
});

module.exports = {
  getArtistDashboard, getArtistSongs
};
