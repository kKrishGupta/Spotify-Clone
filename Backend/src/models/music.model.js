const mongoose =
  require("mongoose");

const musicSchema =
  new mongoose.Schema(
    {
      uri: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      artist: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "user",

        required: true,
      },

      genre: {
        type: String,
        default: "Unknown",
        index: true,
      },

      audioLanguage: {
        type: String,

        enum: [
          "Hindi",
          "Punjabi",
          "Tamil",
          "Telugu",
          "Gujarati",
          "Marathi",
          "English",
        ],

        default: "Hindi",
      },

      mood: [
        {
          type: String,
        },
      ],

      tags: [
        {
          type: String,
        },
      ],

      /* =====================================
         🤖 AI METADATA LAYER
      ===================================== */

      embedding: {
        type: Object,
        default: {},
      },

      aiScore: {
        type: Number,
        default: 0,
      },

      semanticTags: {
        type: [String],
        default: [],
      },

      searchTokens: {
        type: [String],
        default: [],
      },

      /* =====================================
         🖼 MEDIA
      ===================================== */

      thumbnail: {
        type: String,
        default: "",
      },

      lyrics: {
        type: String,
        default: "",
      },

      waveform: {
        type: String,
        default: "",
      },

      hls: {
        type: String,
        default: "",
      },

      processedFiles: {
        bitrates: {
          type: [String],
          default: [],
        },
      },

      /* =====================================
         🎵 AUDIO METADATA
      ===================================== */

      duration: {
        type: Number,
        default: 0,
      },

      quality: {
        type: [String],
        default: [
          "128kbps",
        ],
      },

      region: {
        type: String,
        default: "India",
      },

      /* =====================================
         📊 ANALYTICS
      ===================================== */

      plays: {
        type: Number,
        default: 0,
      },

      likes: {
        type: Number,
        default: 0,
      },

      isTrending: {
        type: Boolean,
        default: false,
      },

      /* =====================================
         🛡 MODERATION
      ===================================== */

      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "rejected",
        ],

        default: "pending",
      },

      source: {
        type: String,

        enum: [
          "upload",
          "api",
        ],

        default: "upload",
      },
    },

    {
      timestamps: true,
    }
  );

/* =========================================
   🔍 SEARCH INDEXES
========================================= */

musicSchema.index({
  title: "text",
  genre: "text",
  tags: "text",
  semanticTags: "text",
  searchTokens: "text",
});

/* =========================================
   📈 ANALYTICS INDEXES
========================================= */

musicSchema.index({
  plays: -1,
});

musicSchema.index({
  likes: -1,
});

musicSchema.index({
  createdAt: -1,
});

musicSchema.index({
  aiScore: -1,
});

/* =========================================
   🚀 EXPORT
========================================= */

module.exports =
  mongoose.model(
    "music",
    musicSchema
  );