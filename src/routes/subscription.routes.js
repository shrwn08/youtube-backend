import express from 'express';
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getMySubscriptions,
  getChannelSubscribers,
  checkSubscription,
  toggleNotification
} from '../controllers/subscription.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const subscriptionRoutes = express.Router();

// Subscribe to a channel
subscriptionRoutes.post('/:channelId', verifyToken, subscribeToChannel);

// Unsubscribe from a channel
subscriptionRoutes.delete('/:channelId', verifyToken, unsubscribeFromChannel);

// Get user's subscriptions
subscriptionRoutes.get('/my-subscriptions', verifyToken, getMySubscriptions);

// Get channel subscribers
subscriptionRoutes.get('/channel/:channelId/subscribers', getChannelSubscribers);

// Check subscription status
subscriptionRoutes.get('/check/:channelId', verifyToken, checkSubscription);

// Toggle notification
subscriptionRoutes.patch('/:channelId/notify', verifyToken, toggleNotification);

export default subscriptionRoutes;