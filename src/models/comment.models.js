import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true // Add index for faster queries
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
        index: true
    },
    content: {
        type: String,
        trim: true,
        required: true,
        maxlength: 1000 // Limit comment length
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    replies: [{
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        content: { 
            type: String, 
            required: true,
            maxlength: 1000 
        },
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }],
    // Track users who liked/disliked to prevent duplicate actions
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

// Compound index for faster queries on video comments
commentsSchema.index({ videoId: 1, createdAt: -1 });

const Comments = mongoose.model("Comments", commentsSchema);
export default Comments;