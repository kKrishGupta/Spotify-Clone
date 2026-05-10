const z = require("zod");

exports.followUserSchema =
  z.object({
    id: z.string(),
  });