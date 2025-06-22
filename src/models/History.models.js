import mongoose from "mongoose";


const historySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    // Changed to an array of objects to include watch time
    videos: {
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
}}, { timestamps: true });

// Index for faster history retrieval
historySchema.index({ userId: 1, "videos.watchedAt": -1 });

const History = mongoose.model("History", historySchema);
export default History;