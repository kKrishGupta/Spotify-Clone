const z = require("zod");

exports.chatSchema = z.object({
  message: z.string().min(2),
});