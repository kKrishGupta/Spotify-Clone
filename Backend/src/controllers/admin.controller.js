const asyncHandler = require("../utils/asyncHandler");
const musicModel = require("../models/music.model");
const userModel = require("../models/user.models");

// 🔥 Get all songs (including pending)
const getAllSongsAdmin = asyncHandler(async(req,res) =>{
  const songs = await musicModel.find().populate("artist","username email");
  res.status(200).json({
      success: true,
      songs
  });
});

// Approve Songs

const approveSong = asyncHandler(async(req,res) =>{
  const song = await musicModel.findByIdAndUpdate(req.params.id,
    {status:"approved"},
    {new: true}
  );

  res.status(200).json({
    message:"Song approved",
    song
  });
})

// 🔥 Reject song
const rejectSong = asyncHandler(async(req,res) =>{
  const song = await musicModel.findByIdAndUpdate(req.params.id,{status:"rejected"},{new:true});
  
  res.status(200).json({
    message:"Song rejected",
    song
  });
});

const deleteSong = asyncHandler(async (req, res) => {
  await musicModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Song deleted"
  });
});


const getAdminDashboard = asyncHandler(async(req,res) =>{
  const totalUsers = await userModel.countDocuments();
  const totalSongs = await musicModel.countDocuments();
  const pendingSongs = await musicModel.countDocuments({status:"pending"});

  const totalPlayAgg = await musicModel.aggregate([
    {
     $group: {
        _id: null,
        totalPlays: { $sum: "$plays" }
      }
    }
  ]);

  res.status(200).json({
    success:true,
    data:{
      totalUsers,
      totalSongs,
      pendingSongs,
      totalPlays: totalPlaysAgg[0]?.totalPlays || 0
    }
  });
});

module.exports = {
  getAllSongsAdmin,
  approveSong,
  rejectSong,
  deleteSong,
  getAdminDashboard
};