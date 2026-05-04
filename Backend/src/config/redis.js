const redis = require("redis");

const isTLS = process.env.REDIS_URL.startsWith("rediss://");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: isTLS, // ✅ AUTO DETECT
    rejectUnauthorized: false, // ✅ needed for Redis Cloud

    reconnectStrategy: (retries) => {
      console.log(`🔁 Redis retry attempt: ${retries}`);
      if (retries > 5) {
        console.log("❌ Redis retry limit reached");
        return new Error("Retry limit reached");
      }
      return Math.min(retries * 500, 3000);
    },
  },
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

client.on("connect", () => {
  console.log("🔌 Connecting to Redis...");
});

client.on("ready", () => {
  console.log("✅ Redis ready");
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
  }
})();

module.exports = client;