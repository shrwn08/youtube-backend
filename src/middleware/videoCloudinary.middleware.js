import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
      cloud_name: process.env.VIDEO_CLOUD_NAME,
      api_key: process.env.VIDEO_API_KEY,
      api_secret: process.env.VIDEO_API_SECRET,
    });
const uploadVideoToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    

    const videoStream = cloudinary.uploader.upload_stream({
        resource_type: "video",
        folder: "video-upload",
        eager: [
          { 
            width: 1280, 
            height: 720, 
            crop: "limit",
            quality: "auto"
          }
        ],
        eager_async: true,
        eager_notification_url: null
        // REMOVED metadata completely
      },
    (error, result) => {
      if (error) reject(error);
      resolve(result);
    }
);
    
    streamifier.createReadStream(file.buffer).pipe(videoStream);
  });
};


export default uploadVideoToCloudinary;
