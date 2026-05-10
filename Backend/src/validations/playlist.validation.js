const z = require("zod");

exports.createPlaylistSchema =
  z.object({
    name: z.string().min(2),
  });

exports.addSongSchema =
  z.object({
    songId: z.string(),
  });