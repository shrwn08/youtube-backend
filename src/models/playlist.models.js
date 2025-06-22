import mongoose from "mongoose";

/**
 * Playlist schema for user video collections
 */
const playlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Array of objects to track video order and added date
    videos: [{
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        position: Number
    }],
    // Playlist visibility settings
    visibility: {
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "public"
    },
    // Playlist thumbnail (can be first video's thumbnail)
    thumbnail: String,
    // Track total videos count for quick display
    videoCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for public playlists
playlistSchema.index({ userId: 1, visibility: 1 });

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;