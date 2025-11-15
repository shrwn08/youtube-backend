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
import likeRoutes from "./routes/like.routes.js";
import historyRoutes from "./routes/history.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";




// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080; // Added default port

// Configure CORS for your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); //for formdata

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
// Authentication & User Management
app.use("/api/auth", userRouter);

// Video Management
app.use("/api/videos", videoRoutes);

// Comments & Replies
app.use("/api/comments", commentRoutes);
app.use("/api/replies", replyRoutes);

// Channel Management
app.use("/api/channels", channelRoutes);

// Subscriptions
app.use("/api/subscriptions", subscriptionRoutes);

// Playlists
app.use("/api/playlists", playlistRoutes);

// Likes
app.use("/api/likes", likeRoutes);

// Watch History
app.use("/api/history", historyRoutes);

// Search & Discovery
app.use("/api/search", searchRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handling middleware (basic example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Allowed origin: ${corsOptions.origin}`);
});