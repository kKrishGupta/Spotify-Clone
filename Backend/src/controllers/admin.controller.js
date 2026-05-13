const asyncHandler = require("../utils/asyncHandler");
const musicModel = require("../models/music.model");
const userModel = require("../models/user.model");
const notificationService = require("../service/notification.service");

const Notification = require("../models/notification.model");
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

  const totalPlaysAgg = await musicModel.aggregate([
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

// 🚀 SEND SINGLE USER NOTIFICATION
const sendAdminNotification =
  asyncHandler(async (req, res) => {

    const {
      user,
      title,
      message,
      type = "admin",
      metadata = {},
    } = req.body;

    await notificationService.sendNotification({
      user,
      type,
      title,
      message,
      metadata,
    });

    res.status(200).json({
      success: true,
      message:
        "Notification sent successfully",
    });
  });

// 🚀 BROADCAST NOTIFICATION
const broadcastNotification =
  asyncHandler(
    async (req, res) => {

      const {
        title,
        message,
        type = "broadcast",
        metadata = {},
      } = req.body;

      // ✅ GET ALL USERS
      const users =
        await userModel.find(
          {},
          "_id"
        );

      // ✅ EXTRACT IDS
      const userIds =
        users.map(
          (u) => u._id
        );

      // ✅ SEND TO ALL
      await notificationService.broadcastNotification(
        {
          users:
            userIds,

          type,

          title,

          message,

          metadata,
        }
      );

      res.status(200).json({
        success: true,

        totalUsers:
          users.length,

        message:
          "Broadcast notification sent",
      });
    }
  );

// 🚀 PLAN/SCHEDULE NOTIFICATION
const planNotification =
  asyncHandler(async (req, res) => {

    const {
      users,
      title,
      message,
      scheduledFor,
      type = "scheduled",
    } = req.body;

    const notifications =
      users.map((user) => ({
        user,

        title,

        message,

        type,

        scheduledFor,

        isScheduled: true,
      }));

    await Notification.insertMany(
      notifications
    );

    res.status(200).json({
      success: true,

      message:
        "Notifications scheduled successfully",
    });
  });

module.exports = {
  getAllSongsAdmin,
  approveSong,
  rejectSong,
  deleteSong,
  getAdminDashboard,
  sendAdminNotification,
  broadcastNotification,
  planNotification,
};