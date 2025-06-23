import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    // Reference to the user who owns this channel
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    
    // Basic channel info
    channel_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    
    // Handle will match the user's username
    handle: {
        type: String,
        trim: true,
        unique: true,
        immutable: true // Can't be changed after creation
    },
    
    // Channel branding
    avatar: {
        type: String,
        default: "" // Will be set to user's avatar when creating channel
    },
    
    banner: {
        type: String,
        default: ""
    },
    
    // Channel stats
    subscribersCount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    videosCount: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Social links
    socialLinks: {
        website: String,
        twitter: String,
        instagram: String
    }
}, {
    timestamps: true
});


channelSchema.post("save", async function(doc, next) {
    try {
        const User = mongoose.model("User");
        
        // Update the user with channel reference and set hasOwnChannel to true
        await User.findByIdAndUpdate(doc.user, {
            channel: doc._id,
            hasOwnChannel: true
        });
        
        next();
    } catch (error) {
        next(error);
    }
});

// (Keep your existing static methods and indexes here...)

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;