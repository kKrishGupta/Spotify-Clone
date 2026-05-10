const mongoose =
  require("mongoose");

const analyticsSchema =
  new mongoose.Schema(
    {
      type: String,

      value: Number,

      meta: Object,
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "analytics",
    analyticsSchema
  );