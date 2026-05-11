const asyncHandler =require("../utils/asyncHandler");
const {resolveSongData} = require('../service/songResolver.service');
const Playlist =require("../models/playlist.model");

// 🚀 CREATE PLAYLIST
const createPlaylist =asyncHandler(async (req, res) => {
  const { name } =req.body;

      if (!name) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Playlist name is required",
          });
      }

      const playlist =
        await Playlist.create(
          {
            name,

            user:
              req.user.id,
          }
        );

      res.status(201).json({
        success: true,

        playlist,
      });
    }
  );

// 🚀 ADD SONG TO PLAYLIST
const addSongToPlaylist =
  asyncHandler(
    async (req, res) => {
      const {
        playlistId,
      } = req.params;

      const body =
        req.body || {};

      const {
        songId,
      } = body;

      // 🔥 VALIDATION
      if (!songId) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "songId is required",
          });
      }

      // ✅ FIND PLAYLIST
      const playlist =
        await Playlist.findById(
          playlistId
        );

      if (!playlist) {
        return res
          .status(404)
          .json({
            success:
              false,

            message:
              "Playlist not found",
          });
      }

      // 🔥 DUPLICATE CHECK
      const exists =
        playlist.songs.some(
          (song) =>
            song.songId ===
            songId
        );

      if (exists) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Song already exists in playlist",
          });
      }

      // 🎵 RESOLVE SONG DATA
      const songData =
        await resolveSongData(
          songId
        );

      if (!songData) {
        return res
          .status(404)
          .json({
            success:
              false,

            message:
              "Song not found",
          });
      }

      // 🚀 ADD SONG
      playlist.songs.push(
        songData
      );

      // 💾 SAVE PLAYLIST
      await playlist.save();

      // ✅ RESPONSE
      res.status(200).json({
        success: true,

        message:
          "Song added successfully",

        playlist,
      });
    }
  );

// 🚀 GET USER PLAYLISTS
const getUserPlaylists =
  asyncHandler(
    async (req, res) => {
      const playlists =
        await Playlist.find(
          {
            user:
              req.user.id,
          }
        );

      res.status(200).json({
        success: true,

        playlists,
      });
    }
  );

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  getUserPlaylists,
};