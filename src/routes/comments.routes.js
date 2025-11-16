import express from 'express';
import { createComment, getComments } from '../controllers/comments.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const commentRoutes = express.Router();

// Create comment (requires authentication)
commentRoutes.post('/videos/:videoId', verifyToken, createComment);

// Get comments for a video (public)
commentRoutes.get('/videos/:videoId', getComments);

export default commentRoutes;