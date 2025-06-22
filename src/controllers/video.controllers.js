import Video from "../models/video.models.js";
import uploadVideoToCloudinary from "../middleware/videoCloudinary.middleware.js";

export const uploadVideo = async (req, res) => {
    const userId = req.user.userId;
    const { title, description,category } = req.body;

    try {
        if(!req.file) return res.status(400).json({ message: "Video not uploaded" });

         if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and category are required"
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
        });
        
        res.status(201).json({ 
             success: true,
            message: "Video uploaded successfully",
            video });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload video",
            error: error.message,
        });
    }
}

export const getAllVideos = async (req, res) => {
    try {
        
        const allVideos = await Video.find({ 
            duration: { $gte: 61 } 
        })
        .populate('user', 'username avatar') 
        .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            count: allVideos.length,
            videos: allVideos
        });

    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({
            success: false, 
            message: "Failed to get all videos", 
            error: error.message
        });
    }
}

export const getShorts = async (req, res) => {
    try {
        
        const allVideos = await Video.find({ 
            duration: { $lte : 60 } 
        })
        .populate('user', 'username avatar') 
        .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            count: allVideos.length,
            videos: allVideos
        });

    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({
            success: false, 
            message: "Failed to get all videos", 
            error: error.message
        });
    }
}





