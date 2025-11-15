import History from "../models/history.models.js";
import Video from "../models/video.models.js";
import mongoose from "mongoose";

/**
 * Add video to watch history
 * POST /api/history/:videoId
 */
export const addToHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID"
      });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Find or create history document
    let history = await History.findOne({ userId });

    if (!history) {
      history = await History.create({
        userId,
        videos: []
      });
    }

    // Remove video if already in history (to update timestamp)
    history.videos = history.videos.filter(
      v => v.videoId.toString() !== videoId
    );

    // Add video to beginning (most recent)
    history.videos.unshift({
      videoId,
      watchedAt: new Date()
    });

    // Limit history to 1000 videos (handled by pre-save hook)
    await history.save();

    // Increment video view count
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      message: "Added to history",
      views: video.views
    });

  } catch (error) {
    console.error("Add to history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get user's watch history
 * GET /api/history/my-history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, skip = 0 } = req.query;

    const history = await History.findOne({ userId })
      .populate({
        path: 'videos.videoId',
        select: 'title thumbnail duration views videoUrl user createdAt',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });

    if (!history) {
      return res.status(200).json({
        success: true,
        count: 0,
        videos: []
      });
    }

    // Filter out deleted videos and apply pagination
    const validVideos = history.videos
      .filter(v => v.videoId)
      .slice(parseInt(skip), parseInt(skip) + parseInt(limit));

    res.status(200).json({
      success: true,
      count: validVideos.length,
      total: history.videos.filter(v => v.videoId).length,
      videos: validVideos
    });

  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Clear watch history
 * DELETE /api/history/clear
 */
export const clearHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    await History.findOneAndUpdate(
      { userId },
      { videos: [] },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "History cleared successfully"
    });

  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Remove specific video from history
 * DELETE /api/history/:videoId
 */
export const removeFromHistory = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID"
      });
    }

    const history = await History.findOne({ userId });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found"
      });
    }

    const initialLength = history.videos.length;
    history.videos = history.videos.filter(
      v => v.videoId.toString() !== videoId
    );

    if (history.videos.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Video not found in history"
      });
    }

    await history.save();

    res.status(200).json({
      success: true,
      message: "Video removed from history"
    });

  } catch (error) {
    console.error("Remove from history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};