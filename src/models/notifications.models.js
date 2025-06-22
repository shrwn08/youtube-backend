import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    // More flexible notification system
    type: {
        type: String,
        enum: ["subscription", "like", "comment", "reply", "system"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    relatedVideo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    read: {
        type: Boolean,
        default: false
    },
    // For action buttons in notifications
    actionUrl: String
}, { timestamps: true });

// Index for unread notifications
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;