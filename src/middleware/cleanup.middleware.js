import Video from "../models/video.models.js";
import cloudinary from "cloudinary";

// Middleware to clean up failed uploads
export const cleanupFailedUpload = async (err, req, res, next) => {
  if (req.file && req.file.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(req.file.cloudinaryPublicId, {
        resource_type: 'video'
      });
      console.log(`Cleaned up failed upload: ${req.file.cloudinaryPublicId}`);
    } catch (error) {
      console.error('Failed to cleanup Cloudinary file:', error);
    }
  }
  next(err);
};

// Cron job to clean up abandoned uploads
export const cleanupAbandonedUploads = async () => {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  const abandonedVideos = await Video.find({
    status: 'temporary',
    createdAt: { $lt: cutoffDate }
  });

  for (const video of abandonedVideos) {
    try {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
        resource_type: 'video'
      });
      await Video.deleteOne({ _id: video._id });
      console.log(`Cleaned up abandoned video: ${video._id}`);
    } catch (err) {
      console.error(`Failed to clean up video ${video._id}:`, err);
    }
  }
};