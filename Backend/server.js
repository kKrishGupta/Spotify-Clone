require('dotenv').config();   // ✅ load first

const app = require('./src/app');
const connectDB = require('./src/config/db');
const {PORT}  = require('./src/config/env');
// ❗ FIX: make DB connection awaited
connectDB()
  .then(() => {
    console.log("DataBase connect successfully");

    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });