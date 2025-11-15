import LikedVideo from "../models/likedVideo.models.js";

/**
 * Like a video
 * POST /api/liked/:videoId
 */
export const likeVideo = async (req, res) => {
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

    // Find or create liked videos document for user
    let likedVideos = await LikedVideo.findOne({ userId });

    if (!likedVideos) {
      likedVideos = await LikedVideo.create({
        userId,
        videos: []
      });
    }

    // Check if already liked
    const alreadyLiked = likedVideos.videos.some(
      v => v.videoId.toString() === videoId
    );

    if (alreadyLiked) {
      return res.status(409).json({
        success: false,
        message: "Video already liked"
      });
    }

    // Add to liked videos
    likedVideos.videos.push({
      videoId,
      likedAt: new Date()
    });
    await likedVideos.save();

    // Increment video like count
    video.likes += 1;
    await video.save();

    res.status(200).json({
      success: true,
      message: "Video liked successfully",
      likes: video.likes
    });

  } catch (error) {
    console.error("Like video error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Unlike a video
 * DELETE /api/liked/:videoId
 */
export const unlikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID"
      });
    }

    // Find liked videos document
    const likedVideos = await LikedVideo.findOne({ userId });

    if (!likedVideos) {
      return res.status(404).json({
        success: false,
        message: "Video not liked"
      });
    }

    // Remove from liked videos
    const initialLength = likedVideos.videos.length;
    likedVideos.videos = likedVideos.videos.filter(
      v => v.videoId.toString() !== videoId
    );

    if (likedVideos.videos.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Video not found in liked videos"
      });
    }

    await likedVideos.save();

    // Decrement video like count
    const video = await Video.findById(videoId);
    if (video && video.likes > 0) {
      video.likes -= 1;
      await video.save();
    }

    res.status(200).json({
      success: true,
      message: "Video unliked successfully"
    });

  } catch (error) {
    console.error("Unlike video error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get user's liked videos
 * GET /api/liked/my-liked-videos
 */
export const getLikedVideos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, skip = 0 } = req.query;

    const likedVideos = await LikedVideo.findOne({ userId })
      .populate({
        path: 'videos.videoId',
        select: 'title thumbnail duration views likes videoUrl user createdAt',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });

    if (!likedVideos) {
      return res.status(200).json({
        success: true,
        count: 0,
        videos: []
      });
    }

    // Sort by most recently liked and filter deleted videos
    const sortedVideos = likedVideos.videos
      .filter(v => v.videoId)
      .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
      .slice(parseInt(skip), parseInt(skip) + parseInt(limit));

    res.status(200).json({
      success: true,
      count: sortedVideos.length,
      total: likedVideos.videos.filter(v => v.videoId).length,
      videos: sortedVideos
    });

  } catch (error) {
    console.error("Get liked videos error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Check if user liked a video
 * GET /api/liked/check/:videoId
 */
export const checkLikedStatus = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video ID"
      });
    }

    const likedVideos = await LikedVideo.findOne({ userId });

    const isLiked = likedVideos?.videos.some(
      v => v.videoId.toString() === videoId
    ) || false;

    res.status(200).json({
      success: true,
      isLiked
    });

  } catch (error) {
    console.error("Check liked status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
