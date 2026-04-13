require('dotenv').config();   // ✅ load first

const app = require('./src/app');
const port = process.env.PORT || 3000;
const connectDB = require('./src/config/db');

// ❗ FIX: make DB connection awaited
connectDB()
  .then(() => {
    console.log("DataBase connect successfully");

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });

  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });