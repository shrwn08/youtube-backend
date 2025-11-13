import Video from "../models/video.models.js";
import uploadVideoToCloudinary from "../middleware/videoCloudinary.middleware.js";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "cloudinary";

const VIDEO_STATUS = {
  TEMPORARY: 'temporary',
  COMPLETED: 'completed'
};

const TEMP_UPLOAD_EXPIRY_HOURS = 24;

export const uploadVideo = async (req, res, next) => {
  const userId = req.user.userId;
  const { title, description, category } = req.body;
  const sessionId = uuidv4();

  console.log("Token verified for user",userId)

  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No video file provided",
        code: "MISSING_FILE"
      });
    }

    const result = await uploadVideoToCloudinary(req.file);

    const video = await Video.create({
      title,
      description,
      category,
      user: userId,
      videoUrl: result.secure_url,
      duration: Math.ceil(result.duration),
      status: VIDEO_STATUS.TEMPORARY,
      cloudinaryPublicId: result.public_id,
      expiresAt: new Date(Date.now() + TEMP_UPLOAD_EXPIRY_HOURS * 60 * 60 * 1000),
      uploadSession: sessionId
    });

    // Attach Cloudinary public ID to req.file for potential cleanup
    req.file.cloudinaryPublicId = result.public_id;

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        videoId: video._id,
        status: VIDEO_STATUS.TEMPORARY,
        completionRequired: true,
        expiresIn: `${TEMP_UPLOAD_EXPIRY_HOURS} hours`
      }
    });

  } catch (error) {
    next(error); // Pass to cleanup middleware
  }
};

export const confirmUploadCompletion = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.userId;

  try {
    const video = await Video.findOneAndUpdate(
      {
        _id: videoId,
        user: userId,
        status: VIDEO_STATUS.TEMPORARY
      },
      {
        status: VIDEO_STATUS.COMPLETED,
        expiresAt: null
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found or already completed",
        code: "VIDEO_NOT_FOUND"
      });
    }

    await cloudinary.uploader.remove_tag('temporary', [video.cloudinaryPublicId]);

    res.status(200).json({
      success: true,
      message: "Video upload completed",
      data: video
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to confirm upload",
      code: "CONFIRMATION_FAILED"
    });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const allVideos = await Video.find({ 
      duration: { $gte: 61 },
      status: 'completed'
    })
    .populate('user', 'username avatar') 
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allVideos.length,
      videos: allVideos
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Failed to get all videos", 
      error: error.message
    });
  }
};

export const getShorts = async (req, res) => {
  try {
    const shorts = await Video.find({ 
      duration: { $lte: 60 },
      status: 'completed'
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shorts.length,
      videos: shorts
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Failed to get shorts", 
      error: error.message
    });
  }
};