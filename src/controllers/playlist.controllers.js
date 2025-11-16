import Playlist from "../models/playlist.models.js";
import Video from "../models/video.models.js";  
import mongoose from "mongoose";


/**
 * Create a new playlist
 * POST /api/playlists
 */
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, visibility = "public" } = req.body;
    const userId = req.user.userId;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist title is required"
      });
    }

    const playlist = await Playlist.create({
      userId,
      title: title.trim(),
      description: description?.trim() || "",
      visibility,
      videos: [],
      videoCount: 0
    });

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist
    });

  } catch (error) {
    console.error("Create playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get user's playlists
 * GET /api/playlists/my-playlists
 */
export const getMyPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;

    const playlists = await Playlist.find({ userId })
      .sort({ createdAt: -1 })
      .select('-videos');

    res.status(200).json({
      success: true,
      count: playlists.length,
      playlists
    });

  } catch (error) {
    console.error("Get playlists error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get playlist by ID with videos
 * GET /api/playlists/:playlistId
 */
export const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID"
      });
    }

    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: 'videos.videoId',
        select: 'title thumbnail duration views user videoUrl createdAt',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      })
      .populate('userId', 'username avatar');

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    // Check visibility permissions
    if (playlist.visibility === 'private' && 
        playlist.userId._id.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "This playlist is private"
      });
    }

    // Filter out deleted videos
    playlist.videos = playlist.videos.filter(v => v.videoId);

    res.status(200).json({
      success: true,
      playlist
    });

  } catch (error) {
    console.error("Get playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Add video to playlist
 * POST /api/playlists/:playlistId/videos/:videoId
 */
export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId) || 
        !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this playlist"
      });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const videoExists = playlist.videos.some(
      v => v.videoId.toString() === videoId
    );

    if (videoExists) {
      return res.status(409).json({
        success: false,
        message: "Video already in playlist"
      });
    }

    const position = playlist.videos.length;
    playlist.videos.push({
      videoId,
      addedAt: new Date(),
      position
    });
    playlist.videoCount = playlist.videos.length;

    if (playlist.videos.length === 1) {
      playlist.thumbnail = video.thumbnail;
    }

    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Video added to playlist",
      videoCount: playlist.videoCount
    });

  } catch (error) {
    console.error("Add video to playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Remove video from playlist
 * DELETE /api/playlists/:playlistId/videos/:videoId
 */
export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId) || 
        !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this playlist"
      });
    }

    const initialLength = playlist.videos.length;
    playlist.videos = playlist.videos.filter(
      v => v.videoId.toString() !== videoId
    );

    if (playlist.videos.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Video not found in playlist"
      });
    }

    playlist.videos.forEach((video, index) => {
      video.position = index;
    });

    playlist.videoCount = playlist.videos.length;
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Video removed from playlist"
    });

  } catch (error) {
    console.error("Remove video from playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Update playlist details
 * PUT /api/playlists/:playlistId
 */
export const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, visibility } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID"
      });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this playlist"
      });
    }

    if (title) playlist.title = title.trim();
    if (description !== undefined) playlist.description = description.trim();
    if (visibility) playlist.visibility = visibility;

    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist
    });

  } catch (error) {
    console.error("Update playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Delete playlist
 * DELETE /api/playlists/:playlistId
 */
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID"
      });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this playlist"
      });
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully"
    });

  } catch (error) {
    console.error("Delete playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Reorder videos in playlist
 * PATCH /api/playlists/:playlistId/reorder
 */
export const reorderPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { videoIds } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID"
      });
    }

    if (!Array.isArray(videoIds)) {
      return res.status(400).json({
        success: false,
        message: "videoIds must be an array"
      });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found"
      });
    }

    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this playlist"
      });
    }

    const reorderedVideos = [];
    videoIds.forEach((videoId, index) => {
      const video = playlist.videos.find(
        v => v.videoId.toString() === videoId
      );
      if (video) {
        video.position = index;
        reorderedVideos.push(video);
      }
    });

    playlist.videos = reorderedVideos;
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Playlist reordered successfully"
    });

  } catch (error) {
    console.error("Reorder playlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};