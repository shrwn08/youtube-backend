import mongoose from "mongoose";

/**
 * Video schema with hashtag support
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
        required: true
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
        enum: ["draft", "processing", "published", "unlisted", "private"],
        default: "processing"
    },
    // Monetization settings
    monetization: {
        isMonetized: { type: Boolean, default: false },
        adsEnabled: { type: Boolean, default: false }
    },
    // Age restriction
    isAgeRestricted: {
        type: Boolean,
        default: false
    },
    // Comments settings
    commentsEnabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Indexes for better performance
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ hashtags: 1 });
videoSchema.index({ title: "text", description: "text", hashtags: "text" });

// Middleware to process hashtags before saving
videoSchema.pre("save", function(next) {
    if (this.isModified("description")) {
        // Extract hashtags from description
        const hashtags = this.description.match(/#\w+/g) || [];
        this.hashtags = [...new Set(hashtags.map(tag => tag.slice(1).toLowerCase()))];
    }
    next();
});

const Video = mongoose.model("Video", videoSchema);
export default Video;