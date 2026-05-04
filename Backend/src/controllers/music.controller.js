const musicModel = require("../models/music.model");
const { uploadFile } = require("../service/storage.service");
const albumModel = require("../models/album.model");
const asyncHandler = require("../utils/asyncHandler");
const { getHybridSongs } = require("../service/music.service");
const musicRepo = require("../repositories/music.repository");

// 🚀 NEW: Queue instead of direct DB write
const activityQueue = require("../queues/activity.queue");

// 🎵 CREATE MUSIC
const createMusic = asyncHandler(async (req, res) => {
  const { title, genre } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Music file is required" });
  }

  const file = req.file;
  const result = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: result.url,
    title,
    genre,
    artist: req.user.id,
    source: "upload",
    status: "pending",
  });

  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
      genre: music.genre,
      source: music.source,
      status: music.status,
    },
  });
});

// 🎧 CREATE ALBUM
const createAlbum = asyncHandler(async (req, res) => {
  const { title, musicIds } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musicIds,
  });

  res.status(201).json({
    message: "Album created Successfully!!",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
});

// 🎶 GET ALL MUSIC
const getAllMusics = asyncHandler(async (req, res) => {
  const musics = await getHybridSongs();

  res.status(200).json({
    message: "Musics fetched successfully",
    musics,
  });
});

// 🔥 INCREMENT PLAY (QUEUE BASED)
const incrementPlay = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const music = await musicRepo.incrementPlay(id);

  if (!music) {
    return res.status(404).json({ message: "Song not found" });
  }

  // 🚀 Send to queue instead of DB
  await activityQueue.add("trackActivity", {
    user: req.user.id,
    song: id,
    action: "play",
  });

  res.status(200).json({
    success: true,
    message: "Play count incremented",
    music,
  });
});

// ❤️ LIKE SONG (QUEUE BASED)
const likeSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ✅ 1. Increment likes count
  const music = await musicModel.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!music) {
    return res.status(404).json({ message: "Song not found" });
  }

  // ✅ 2. Store in user profile (IMPORTANT)
  await userModel.findByIdAndUpdate(req.user.id, {
    $addToSet: { likedSongs: id }, // avoids duplicates
  });

  // 🚀 3. Queue activity (non-blocking)
  await activityQueue.add("trackActivity", {
    user: req.user.id,
    song: id,
    action: "like",
  });

  res.status(200).json({
    success: true,
    message: "Song liked",
    music,
  });
});

// 📀 GET ALL ALBUMS
const getAllAlbums = asyncHandler(async (req, res) => {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "username email")
    .populate("musics");

  res.status(200).json({
    message: "Albums fetched Successfully",
    albums,
  });
});

// 📀 GET ALBUM BY ID
const getAlbumById = asyncHandler(async (req, res) => {
  const albumId = req.params.albumId;

  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");

  res.status(200).json({
    message: "Album fetched successfully",
    album,
  });
});

// 🎼 GET MUSIC BY GENRE
const getMusicByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.query;

  const musics = await musicModel.find({
    genre,
    status: "approved",
  });

  res.status(200).json(musics);
});

// 🔍 SEARCH MUSIC
const searchMusic = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.json({ success: true, data: [] });
  }

  const songs = await musicModel
    .find({
      status: "approved",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
      ],
    })
    .populate("artist", "username")
    .limit(20);

  const formattedSongs = songs.map((song) => ({
    id: song._id,
    title: song.title,
    artist: song.artist?.username || "Unknown",
    cover: song.cover || "https://via.placeholder.com/150",
    uri: song.uri,
    plays: song.plays || 0,
    likes: song.likes || 0,
    duration: song.duration || 0,
  }));

  res.json({
    success: true,
    data: formattedSongs,
  });
});

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
  getMusicByGenre,
  incrementPlay,
  likeSong,
  searchMusic,
};