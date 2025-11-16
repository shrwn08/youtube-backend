import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./db/connectDB.js";

// Import all routes
import userRouter from "./routes/authUser.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import replyRoutes from "./routes/reply.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import likeRoutes from "./routes/liked.routes.js";
import historyRoutes from "./routes/history.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
connectDb();

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "YouTube Backend API",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      auth: "/api/auth",
      videos: "/api/videos",
      comments: "/api/comments",
      replies: "/api/replies",
      channels: "/api/channels",
      subscriptions: "/api/subscriptions",
      playlists: "/api/playlists",
      likes: "/api/likes",
      history: "/api/history",
      search: "/api/search",
      notifications: "/api/notifications"
    }
  });
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
});
