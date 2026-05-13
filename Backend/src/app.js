const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const setupSecurity = require('./middlewares/security.middleware');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/error.middleware');


const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const activityRoutes = require('./routes/activity.routes');
const feedRoutes = require('./routes/feed.routes');
const artistRoutes = require('./routes/artist.routes');
const adminRoutes = require('./routes/admin.routes');
const playlistRoutes = require('./routes/playlist.routes');
const rateLimiter = require("./middlewares/rateLimiter");
const aiRoutes = require("./routes/ai.routes");
// Global error handler
const userRoutes = require('./routes/user.routes');
const notificationRoutes = require("./routes/notification.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const healthRoutes =require("./routes/health.routes");
const traceMiddleware = require("./tracing/trace.middleware");
const moderationRoutes = require("./routes/moderation.routes");
const presenceRoutes = require("./routes/presence.routes");
const prometheusRoutes = require("./routes/metrics.routes");
const cors = require('cors');
setupSecurity(app);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(rateLimiter);
app.use(traceMiddleware);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/feed',feedRoutes); 
app.use('/api/artist', artistRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/health',healthRoutes);
app.use('/api/moderation',moderationRoutes);
app.use('/api/presence',presenceRoutes);
app.use('/api/metrics',prometheusRoutes);
app.use(errorHandler);

module.exports = app;