const z = require("zod");

exports.createMusicSchema =
  z.object({
    title: z.string().min(2),

    genre: z.string().min(2),

    language: z.string().optional(),

    tags: z.array(z.string())
      .optional(),
  });