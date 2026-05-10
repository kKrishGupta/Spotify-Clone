const z = require("zod");

exports.registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  role: z.enum(["user", "admin","artist"]).default("user"),
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});