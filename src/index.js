import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./db/connectDB.js";
import userRouter from "./routes/authUser.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import replyRoutes from "./routes/reply.routes.js"; 

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
  res.send("Welcome to the API");
});

// Routes
app.use("/api/auth", userRouter); // Authentication routes
app.use("/api/videos", videoRoutes); // Video routes
app.use("/api/comments", commentRoutes); // Comment routes
app.use("/api/replies", replyRoutes); // reply routes
app.use("/api",channelRoutes) //channel routes

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