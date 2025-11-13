import express from 'express';
import { createComment, getComments } from '../controllers/comments.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const commentRoutes = express.Router();

commentRoutes.post('/videos/:videoId', verifyToken, createComment);
commentRoutes.get('/videos/:videoId', getComments);

export default commentRoutes;
