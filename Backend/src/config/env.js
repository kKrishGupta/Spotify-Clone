require("dotenv").config();
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "IMAGEKIT_PRIVATE_KEY",
  "PORT"
]

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.warn(`Warning: ${env} is not set in environment variables.`);
  }
});

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
} 