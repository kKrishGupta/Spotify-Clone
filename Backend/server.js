require("dotenv").config();
require("./src/workers/activity.worker");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/env");
const { startNgrok } = require("./src/config/ngrok.manager");

// 🚀 CLEAN SERVER BOOTSTRAP
const startServer = async () => {
  try {
    // 1️⃣ Connect DB
    await connectDB();
    console.log("✅ Database connected successfully");

     // 3️⃣ Start ngrok (AFTER server is up)
    await startNgrok();

    
    // 2️⃣ Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

   
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

// 🔥 Start everything
startServer();