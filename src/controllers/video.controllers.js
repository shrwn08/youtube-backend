import Video from "../models/video.models.js";
import uploadVideoToCloudinary from "../middleware/videoCloudinary.middleware.js";

export const uploadVideo = async (req, res) => {
    const id = req.user.userId;
    const { title, description,category } = req.body;

    try {
        if(!req.file) return res.status(400).json({ message: "Video not uploaded" });

        const result = await uploadVideoToCloudinary(req.file);

        const video = await Video.create({
            title,
            description,
            category,
            user: id,
            videoUrl: result.secure_url,
        });
        await video.save()
    } catch (error) {
        
    }
}

