require("dotenv").config();
const requiredEnv = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
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
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  BASE_URL: process.env.BASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
} 