import Video from "../models/video.models.js";
import Channel from "../models/channel.models.js";
import User from "../models/user.models.js";

export const searchVideos = async (req, res) => {
  try {
    const { q, category, duration, sortBy = 'relevance', limit = 20, skip = 0 } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    let query = {
      status: 'completed',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { hashtags: { $regex: q, $options: 'i' } }
      ]
    };

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add duration filter
    if (duration === 'short') {
      query.duration = { $lte: 60 };
    } else if (duration === 'long') {
      query.duration = { $gt: 60 };
    }

    // Determine sort order
    let sort = {};
    switch (sortBy) {
      case 'date':
        sort = { createdAt: -1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'rating':
        sort = { likes: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // Default to recent
    }

    const videos = await Video.find(query)
      .populate('user', 'username avatar')
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Video.countDocuments(query);

    res.status(200).json({
      success: true,
      count: videos.length,
      total,
      videos
    });

  } catch (error) {
    console.error("Search videos error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const searchChannels = async (req, res) => {
  try {
    const { q, limit = 20, skip = 0 } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const channels = await Channel.find({
      $or: [
        { channel_name: { $regex: q, $options: 'i' } },
        { handle: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('user', 'username')
      .sort({ subscribersCount: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Channel.countDocuments({
      $or: [
        { channel_name: { $regex: q, $options: 'i' } },
        { handle: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: channels.length,
      total,
      channels
    });

  } catch (error) {
    console.error("Search channels error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
