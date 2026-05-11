const musicModel = require("../models/music.model");
const { uploadFile } = require("../service/storage.service");
const albumModel = require("../models/album.model");
const asyncHandler = require("../utils/asyncHandler");
const { getHybridSongs } = require("../service/music.service");
const musicRepo = require("../repositories/music.repository");
const userModel = require("../models/user.model");
const logger = require("../config/logger");
const audioQueue = require("../queues/audio.queue");
const analyticsQueue = require("../queues/analytics.queue");
const { invalidateMusicCache } = require("../cache/music.cache");
const { invalidateFeedCache } = require("../cache/feed.cache");
const ExternalSong = require("../models/externalSong.model");

// 🚀 NEW: Queue instead of direct DB write
const activityQueue = require("../queues/activity.queue");

const invalidateMusicMutationCaches = async () => {
  Promise.allSettled([
    invalidateMusicCache("music:all"),
    invalidateFeedCache("feed:global"),
  ]).catch((err) => {
    logger.warn({
      message: "Cache invalidation skipped",
      error: err.message,
    });
  });
};

// 🎵 CREATE MUSIC
const createMusic = asyncHandler(
  async (req, res) => {
    const {title,genre,language} = req.body;

    // ❌ Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Music file is required",
      });
    }

    const file = req.file;
    // ☁ Upload to cloud storage
    const result =
      await uploadFile(
        file.buffer.toString(
          "base64"
        )
      );

    // 💾 Save music metadata
    const music =
      await musicModel.create({
        uri: result.url,
        title,
        genre,
        audioLanguage:
          language,
        artist:
          req.user.id,
        source: "upload",
        status: "pending",
      });

    // 🎧 Queue audio processing
    await audioQueue
      .add(
        "process-upload",
        {
          musicId:
            music._id.toString(),
          url: result.url,
          filename:
            music._id.toString(),
        }
      )
      .catch((err) => {
        logger.warn({
          message:
            "Audio processing queue enqueue failed",
          musicId:
            music._id,
          error:
            err.message,
        });
      });

    // 🧹 Clear caches
    await invalidateMusicMutationCaches();

    // ✅ Response
    res.status(201).json({
      success: true,

      message:
        "Music created successfully",

      music: {
        id: music._id,

        uri: music.uri,

        title:
          music.title,

        genre:
          music.genre,

        audioLanguage:
          music.audioLanguage,

        artist:
          music.artist,

        source:
          music.source,

        status:
          music.status,
      },
    });
  }
);

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

     // 🔥 EXTERNAL SONG
     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
       // FIND EXISTING
       let song =await ExternalSong.findOne({externalId: id,});

       // CREATE IF NOT EXISTS
       if (!song) {
         song =
           await ExternalSong.create(
             {
               externalId:
                 id,

               title:
                 req.body
                   ?.title ||
                 "Unknown",

               artist:
                 req.body
                   ?.artist ||
                 "Unknown",

               cover:
                 req.body
                   ?.cover ||
                 "",

               uri:
                 req.body
                   ?.uri ||
                 "",

               source:
                 req.body
                   ?.source ||
                 "external",
             }
           );
       }

       // 🔥 TRACK PLAY
       song.plays += 1;

       await song.save();

       return res
         .status(200)
         .json({
           success: true,

           external: true,

           message:
             "External song play tracked",

           data: {
             id:
               song.externalId,

             plays:
               song.plays,
           },
         });
     }

     // ✅ NORMAL DB SONG
     const music =
       await musicModel.findById(
         id
       );

     if (!music) {
       return res
         .status(404)
         .json({
           success:
             false,

           message:
             "Song not found",
         });
     }

     music.plays += 1;

     await music.save();

     return res
       .status(200)
       .json({
         success: true,

         external: false,

         message:
           "Song play tracked",

         data: {
           id:
             music._id,

           plays:
             music.plays,
         },
       });
   }
 );

// ❤️ LIKE SONG (QUEUE BASED)
const likeSong =
 asyncHandler(
   async (req, res) => {
     const { id } =
       req.params;

     // 🔥 EXTERNAL SONG
     if (
       !id.match(
         /^[0-9a-fA-F]{24}$/
       )
     ) {

       let song =
         await ExternalSong.findOne(
           {
             externalId: id,
           }
         );

       if (!song) {
         song =
           await ExternalSong.create(
             {
               externalId:
                 id,

               title:
                 req.body
                   ?.title ||
                 "Unknown",

               artist:
                 req.body
                   ?.artist ||
                 "Unknown",

               cover:
                 req.body
                   ?.cover ||
                 "",

               uri:
                 req.body
                   ?.uri ||
                 "",

               source:
                 req.body
                   ?.source ||
                 "external",
             }
           );
       }

       // 🔥 PREVENT DUPLICATE LIKES
       const alreadyLiked =
         song.usersLiked.includes(
           req.user.id
         );

       if (
         !alreadyLiked
       ) {
         song.likes += 1;

         song.usersLiked.push(
           req.user.id
         );

         await song.save();
       }

       return res
         .status(200)
         .json({
           success: true,

           external: true,

           message:
             "External song liked",

           data: {
             id:
               song.externalId,

             likes:
               song.likes,
           },
         });
     }

     // ✅ NORMAL SONG
     const music =
       await musicModel.findById(
         id
       );

     if (!music) {
       return res
         .status(404)
         .json({
           success:
             false,

           message:
             "Song not found",
         });
     }

     music.likes += 1;

     await music.save();

     return res
       .status(200)
       .json({
         success: true,

         external: false,

         message:
           "Song liked",

         data: {
           id:
             music._id,

           likes:
             music.likes,
         },
       });
   }
 );

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

const getMusicByGenre =
  asyncHandler(
    async (req, res) => {
      const {
        genre,
      } = req.query;

      // 🔥 VALIDATION
      if (!genre) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Genre is required",
          });
      }

      // 🔥 GET HYBRID SONGS
      const songs =
        await getHybridSongs();

      // 🔥 FILTER
      const filteredSongs =
        songs.filter(
          (song) => {
            const songGenre =
              (
                song.genre ||
                ""
              ).toLowerCase();

            const title =
              (
                song.title ||
                ""
              ).toLowerCase();

            const artist =
              (
                song.artist ||
                ""
              ).toLowerCase();

            const q =
              genre.toLowerCase();

            // 🔥 MULTI-MATCH SYSTEM
            return (
              songGenre.includes(
                q
              ) ||

              title.includes(
                q
              ) ||

              artist.includes(
                q
              )
            );
          }
        );

      return res
        .status(200)
        .json({
          success: true,

          genre,

          total:
            filteredSongs.length,

          data:
            filteredSongs,
        });
    }
  );

// 🔍 SEARCH MUSIC
const {
  searchSongs,
} = require(
  "../service/search.service"
);

const searchMusic =
  asyncHandler(
    async (req, res) => {
      const {
        query,
        page = 1,
        limit = 20,
      } = req.query;

      // 🔥 EMPTY QUERY
      if (
        !query ||
        !query.trim()
      ) {
        return res.json({
          success: true,
          data: [],
        });
      }

      // 🔥 HYBRID SEARCH
      const results =
        await searchSongs(
          query,
          Number(page),
          Number(limit)
        );

      res.status(200).json({
        success: true,

        total:
          results.total,

        currentPage:
          results.currentPage,

        totalPages:
          results.totalPages,

        data:
          results.songs,
      });
    }
  );

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
