import Comments from "../models/comment.models.js";
import mongoose from "mongoose";


export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!content?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Reply content is required" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid comment ID" 
      });
    }

    // Find the parent comment
    const comment = await Comments.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    // Create reply object
    const reply = {
      userId,
      content: content.trim(),
      likes: 0,
      dislikes: 0,
      createdAt: new Date()
    };

    // Add reply to comment
    comment.replies.push(reply);
    await comment.save();

    // Populate the newly added reply's user info
    await comment.populate({
      path: 'replies.userId',
      select: 'username avatar',
      match: { _id: userId } // Only populate the new reply
    });

    // Get the newly added reply
    const newReply = comment.replies[comment.replies.length - 1];

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply: newReply
    });

  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};


export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid comment ID" 
      });
    }

    const comment = await Comments.findById(commentId)
      .populate('replies.userId', 'username avatar')
      .select('replies');

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    res.status(200).json({
      success: true,
      count: comment.replies.length,
      replies: comment.replies
    });

  } catch (error) {
    console.error("Get replies error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};


export const deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(commentId) || 
        !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid ID format" 
      });
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    // Find the reply
    const replyIndex = comment.replies.findIndex(
      reply => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Reply not found" 
      });
    }

    // Check if user owns the reply
    if (comment.replies[replyIndex].userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized to delete this reply" 
      });
    }

    // Remove the reply
    comment.replies.splice(replyIndex, 1);
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Reply deleted successfully"
    });

  } catch (error) {
    console.error("Delete reply error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};
export const editReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!content?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Reply content is required" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId) || 
        !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid ID format" 
      });
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    // Find the reply
    const reply = comment.replies.find(
      reply => reply._id.toString() === replyId
    );

    if (!reply) {
      return res.status(404).json({ 
        success: false,
        message: "Reply not found" 
      });
    }

    // Check if user owns the reply
    if (reply.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized to edit this reply" 
      });
    }

    // Update the reply
    reply.content = content.trim();
    await comment.save();

    // Populate user info
    await comment.populate('replies.userId', 'username avatar');

    res.status(200).json({
      success: true,
      message: "Reply updated successfully",
      reply
    });

  } catch (error) {
    console.error("Edit reply error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

/**
 * Like a reply
 * POST /api/comments/:commentId/replies/:replyId/like
 */
export const likeReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(commentId) || 
        !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid ID format" 
      });
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    const reply = comment.replies.find(
      reply => reply._id.toString() === replyId
    );

    if (!reply) {
      return res.status(404).json({ 
        success: false,
        message: "Reply not found" 
      });
    }

    // Increment likes (simple implementation)
    // For production, track likedBy users to prevent duplicate likes
    reply.likes += 1;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Reply liked successfully",
      likes: reply.likes
    });

  } catch (error) {
    console.error("Like reply error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

//Dislike a reply
 // POST /api/comments/:commentId/replies/:replyId/dislike

export const dislikeReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(commentId) || 
        !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid ID format" 
      });
    }

    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found" 
      });
    }

    const reply = comment.replies.find(
      reply => reply._id.toString() === replyId
    );

    if (!reply) {
      return res.status(404).json({ 
        success: false,
        message: "Reply not found" 
      });
    }

    // Increment dislikes
    reply.dislikes += 1;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Reply disliked successfully",
      dislikes: reply.dislikes
    });

  } catch (error) {
    console.error("Dislike reply error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

export default {
  addReply,
  getReplies,
  deleteReply,
  editReply,
  likeReply,
  dislikeReply
};