import mongoose from "mongoose";

/**
 * Video schema with hashtag support and upload tracking
 */
const videoSchema = new mongoose.Schema({
    user: { 
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
        maxlength: 5000
    },
    // Hashtags array for better content discovery
    hashtags: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 20
    }],
    category: {
        type: String,
        enum: [
            "Film & Animation",
            "Autos & Vehicles",
            "Music",
            "Pets & Animals",
            "Sports",
            "Travel & Events",
            "Gaming",
            "People & Blogs",
            "Comedy",
            "Entertainment",
            "News & Politics",
            "Howto & Style",
            "Education",
            "Science & Technology",
            "Nonprofits & Activism"
        ],
        index: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    // Multiple quality options
    videoQualities: [{
        quality: String,
        url: String
    }],
    duration: {
        type: Number, // in seconds
        required: true
    },
    thumbnail: {
        type: String,
        required: false // Made optional since it might be generated
    },
    // Multiple thumbnail options
    thumbnails: {
        default: String,
        medium: String,
        high: String,
        standard: String,
        maxres: String
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    // Engagement tracking
    engagement: {
        watchTime: { type: Number, default: 0 },
        averageViewDuration: { type: Number, default: 0 }
    },
    // Video status
    status: {
        type: String,
        enum: ["draft", "processing", "published", "unlisted", "private", "temporary", "completed"],
        default: "processing"
    },
  
    // Comments settings
    commentsEnabled: {
        type: Boolean,
        default: true
    },
 
    // Cloudinary public ID for managing uploads
    cloudinaryPublicId: {
        type: String,
        required: false
    },
    // Expiration time for temporary uploads
    expiresAt: {
        type: Date,
        required: false,
        index: true // Index for cleanup queries
    },
    // Session ID for tracking upload completion
    uploadSession: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Indexes for better performance
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ hashtags: 1 });
videoSchema.index({ title: "text", description: "text", hashtags: "text" });
videoSchema.index({ status: 1, expiresAt: 1 }); // For cleanup queries
videoSchema.index({ duration: 1, status: 1 }); // For videos/shorts filtering

// Middleware to process hashtags before saving
videoSchema.pre("save", function(next) {
    if (this.isModified("description") && this.description) {
        // Extract hashtags from description
        const hashtags = this.description.match(/#\w+/g) || [];
        this.hashtags = [...new Set(hashtags.map(tag => tag.slice(1).toLowerCase()))];
    }
    next();
});

// Method to check if video has expired (for temporary uploads)
videoSchema.methods.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
};

// Static method to find expired temporary videos
videoSchema.statics.findExpiredVideos = function() {
    return this.find({
        status: 'temporary',
        expiresAt: { $lt: new Date() }
    });
};

// Static method to complete video upload
videoSchema.statics.completeUpload = async function(videoId, userId) {
    return this.findOneAndUpdate(
        {
            _id: videoId,
            user: userId,
            status: 'temporary'
        },
        {
            status: 'completed',
            expiresAt: null
        },
        { new: true }
    );
};

const Video = mongoose.model("Video", videoSchema);
export default Video;