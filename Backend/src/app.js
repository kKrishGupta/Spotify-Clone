const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const errorHandler = require('./middlewares/error.middleware');
const activityRoutes = require('./routes/activity.routes');
const feedRoutes = require('./routes/feed.routes');
const artistRoutes = require('./routes/artist.routes');
const adminRoutes = require('./routes/admin.routes');
const playlistRoutes = require('./routes/playlist.routes');
const rateLimiter = require("./middlewares/rateLimiter");
const aiRoutes = require("./routes/ai.routes");
// Global error handler
const userRoutes = require('./routes/user.routes');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(rateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/feed',feedRoutes); 
app.use('/api/artist', artistRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use(errorHandler);

module.exports = app;