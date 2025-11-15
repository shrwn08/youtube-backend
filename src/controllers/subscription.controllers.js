import Subscription from "../models/subscription.models.js";
import Channel from "../models/channel.models.js";
import mongoose from "mongoose";

/**
 * Subscribe to a channel
 * POST /api/subscriptions/:channelId
 */
export const subscribeToChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user.userId;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID"
      });
    }

    // Check if channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    // Prevent self-subscription
    if (channel.user.toString() === subscriberId) {
      return res.status(400).json({
        success: false,
        message: "Cannot subscribe to your own channel"
      });
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      subscriberId,
      channelId
    });

    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message: "Already subscribed to this channel"
      });
    }

    // Create subscription
    const subscription = await Subscription.create({
      subscriberId,
      channelId,
      notify: true
    });

    // Update channel subscriber count
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { subscribersCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      subscription
    });

  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Unsubscribe from a channel
 * DELETE /api/subscriptions/:channelId
 */
export const unsubscribeFromChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID"
      });
    }

    // Find and delete subscription
    const subscription = await Subscription.findOneAndDelete({
      subscriberId,
      channelId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    // Update channel subscriber count
    await Channel.findByIdAndUpdate(channelId, {
      $inc: { subscribersCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully"
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get user's subscriptions
 * GET /api/subscriptions/my-subscriptions
 */
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriberId = req.user.userId;

    const subscriptions = await Subscription.find({ subscriberId })
      .populate({
        path: 'channelId',
        select: 'channel_name handle avatar subscribersCount videosCount',
        populate: {
          path: 'user',
          select: 'username'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });

  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Get channel's subscribers
 * GET /api/subscriptions/channel/:channelId/subscribers
 */
export const getChannelSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID"
      });
    }

    const subscribers = await Subscription.find({ channelId })
      .populate('subscriberId', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });

  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Check if user is subscribed to a channel
 * GET /api/subscriptions/check/:channelId
 */
export const checkSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID"
      });
    }

    const subscription = await Subscription.findOne({
      subscriberId,
      channelId
    });

    res.status(200).json({
      success: true,
      isSubscribed: !!subscription
    });

  } catch (error) {
    console.error("Check subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Toggle notification for a subscription
 * PATCH /api/subscriptions/:channelId/notify
 */
export const toggleNotification = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID"
      });
    }

    const subscription = await Subscription.findOne({
      subscriberId,
      channelId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    subscription.notify = !subscription.notify;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: `Notifications ${subscription.notify ? 'enabled' : 'disabled'}`,
      notify: subscription.notify
    });

  } catch (error) {
    console.error("Toggle notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
