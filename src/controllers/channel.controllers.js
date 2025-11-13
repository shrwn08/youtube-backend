import Channel from "../models/channel.models.js";
import User from "../models/user.models.js";
import profileUploadToCloudinary from "../middleware/profileCloudinary.middleware.js";

export const createChannel = async (req, res) => {

  // Validation
  if (!req.user) {
    console.log("Error: No authenticated user");
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.body.channel_name) {
    console.log("Error: Missing channel name");
    return res.status(400).json({ message: "Channel name is required" });
  }

  if (!req.file) {
    console.log("Error: No file uploaded");
    return res.status(400).json({ message: "Channel avatar is required" });
  }

  try {
    // console.log("Uploading to Cloudinary...");
    const result = await profileUploadToCloudinary(req.file);
    console.log(req.params.id)
    const channelData = {
      user: req.params.id,
      channel_name: req.body.channel_name,
      avatar: result.secure_url,
    };

    
    const channel = await Channel.create(channelData);

    
        return res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel
      
    });
    

  } catch (error) {
    console.error("Error:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already has a channel"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};