import express from 'express';
import {
  addToHistory,
  getHistory,
  clearHistory,
  removeFromHistory
} from '../controllers/history.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const historyRoutes = express.Router();

// Add to history (also increments view count)
historyRoutes.post('/:videoId', verifyToken, addToHistory);

// Get user's watch history
historyRoutes.get('/my-history', verifyToken, getHistory);

// Clear all history
historyRoutes.delete('/clear', verifyToken, clearHistory);

// Remove specific video from history
historyRoutes.delete('/:videoId', verifyToken, removeFromHistory);

export default historyRoutes;