const mongoose = require("mongoose");

const logger = require("./logger");

const { MONGO_URI } = require("./env");

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }
    const timeoutMs = Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000);

    await Promise.race([
      mongoose.connect(MONGO_URI, {
        autoIndex: false,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: timeoutMs,
      }),
      new Promise((resolve, reject) => {
        setTimeout(
          () => reject(new Error("MongoDB connection timed out")),
          timeoutMs + 1000
        );
      }),
    ]);

    logger.info(
      "✅ MongoDB connected"
    );
  } catch (err) {
    logger.error({
      dbError: err.message,
    });

    throw err;
  }
};

module.exports = connectDB;
