import Comments from "../models/comment.models.js";
import mongoose from "mongoose";


export const createComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content?.trim()) {  //  Add trim() check
      return res.status(400).json({ message: "Content is required" });
    }

    // Add validation for videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const comment = await Comments.create({ userId, videoId, content: content.trim() });
    
    //  Populate user info before sending response
    await comment.populate('userId', 'username avatar');
    
    res.status(201).json({ 
      message: "Comment created successfully", 
      comment 
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

export const deleteComment = async (req, res) => {

}

export const editComment = async (req, res) => {

}

export const getComments = async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) return res.status(400).json({ message: "Video ID is required" });
    
    try {
        const comments = await Comments.find({ videoId }).populate("userId", "username");
        res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        res.status(500).json({ message: "Server error " });
    }
}
