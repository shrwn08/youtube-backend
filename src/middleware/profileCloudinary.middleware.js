import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.PROFILE_CLOUD_NAME,
  api_key: process.env.PROFILE_API_KEY,
  api_secret: process.env.PROFILE_API_SECRET,
});

export default function profileUploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      console.error("Invalid file buffer");
      return reject(new Error("Invalid file data"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "channel-avatars",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto" }
        ]
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Failed to upload image"));
        } else {
          console.log("Upload successful:", result.secure_url);
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}