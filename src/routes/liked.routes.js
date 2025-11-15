import express from 'express';
import {
  likeVideo,
  unlikeVideo,
  getLikedVideos,
  checkLikedStatus
} from '../controllers/liked.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const likedRoutes = express.Router();

// Like video
likedRoutes.post('/:videoId', verifyToken, likeVideo);

// Unlike video
likedRoutes.delete('/:videoId', verifyToken, unlikeVideo);

// Get user's liked videos
likedRoutes.get('/my-liked-videos', verifyToken, getLikedVideos);

// Check if video is liked by user
likedRoutes.get('/check/:videoId', verifyToken, checkLikedStatus);

export default likedRoutes;