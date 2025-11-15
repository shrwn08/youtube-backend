import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount
} from '../controllers/notification.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const notificationRoutes = express.Router();

// Get unread notification count
notificationRoutes.get('/unread-count', verifyToken, getUnreadCount);

// Get notifications (with optional filters)
notificationRoutes.get('/', verifyToken, getNotifications);

// Mark specific notification as read
notificationRoutes.patch('/:notificationId/read', verifyToken, markAsRead);

// Mark all notifications as read
notificationRoutes.patch('/read-all', verifyToken, markAllAsRead);

// Delete specific notification
notificationRoutes.delete('/:notificationId', verifyToken, deleteNotification);

// Clear all notifications
notificationRoutes.delete('/clear', verifyToken, clearAllNotifications);

export default notificationRoutes;
