import mongoose from "mongoose";

const historySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    videos: [{  // FIXED: Changed from object to array
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        watchedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Pre-save hook to limit history to 1000 videos
historySchema.pre('save', function(next) {
    if (this.videos.length > 1000) {
        this.videos = this.videos.slice(0, 1000);
    }
    next();
});

historySchema.index({ userId: 1, "videos.watchedAt": -1 });

const History = mongoose.model("History", historySchema);
export default History;