import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true  // Ensures this field is mandatory
    },
    subscribes_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now  // Automatically sets to current timestamp
    }
});  

export const Subscription = mongoose.model("Subscription", subscriptionSchema);