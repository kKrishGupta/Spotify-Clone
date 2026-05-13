const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "user",

        required: true,
      },

      type: {
        type: String,

        enum: [
          "follow",
          "like",
          "upload",
          "playlist",
          "system",
          "broadcast",
          "admin",
          "scheduled",
        ],

        default:
          "system",
      },

      title: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        required: true,
      },

      metadata: {
        type: Object,
        default: {},
      },

      read: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

notificationSchema.index({
  user: 1,
  read: 1,
});

module.exports =
  mongoose.model(
    "notification",
    notificationSchema
  );