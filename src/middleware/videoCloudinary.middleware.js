import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

const videoCloudinary = cloudinary;

const uploadVideoToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    videoCloudinary.config({
      cloud_name: process.env.VIDEO_CLOUD_NAME,
      api_key: process.env.VIDEO_API_KEY,
      api_secret: process.env.VIDEO_API_SECRET,
    });

    const videoStream = cloudinary.uploader.upload_stream({
      folder: "video-upload",
      transformation: [
        { width: 1280, height: 720, crop: "limit" },
        { quality: "auto" },
      ],
    });
    (error, result) => {
      if (error) reject(error);
      resolve(result);
    };
    streamifier.createReadStream(file.path).pipe(videoStream);
  });
};

export default uploadVideoToCloudinary;
