import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

function profileUploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const profileCloudinary = cloudinary;
    profileCloudinary.config({
      cloud_name: process.env.PROFILE_CLOUD_NAME,
      api_key: process.env.PROFILE_API_KEY,
      api_secret: process.env.PROFILE_API_SECRET,
    });
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-img",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          {
            quality: "auto",
          },
        ],
      },

      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

export default profileUploadToCloudinary;
