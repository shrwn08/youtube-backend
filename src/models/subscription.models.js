import mongoose from "mongoose";

/**
 * Subscription schema for user subscriptions
 */
const subscriptionSchema = new mongoose.Schema({
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    // Subscription tier (for potential monetization)
    tier: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
    },
    // Notification preferences
    notify: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Compound index for unique subscriptions
subscriptionSchema.index({ subscriberId: 1, channelId: 1 }, { unique: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;