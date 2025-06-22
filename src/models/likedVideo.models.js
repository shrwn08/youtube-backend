import mongoose from "mongoose";


const likedVideoSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    // Array of objects to track when videos were liked
    videos: [{
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Index for faster liked videos retrieval
likedVideoSchema.index({ userId: 1, "videos.likedAt": -1 });

const LikedVideo = mongoose.model("LikedVideo", likedVideoSchema);
export default LikedVideo;