import express from 'express';
import {
  addReply,
  getReplies,
  deleteReply,
  editReply,
  likeReply,
  dislikeReply
} from '../controllers/reply.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const replyRoutes = express.Router();

replyRoutes.post('/:commentId/replies', verifyToken, addReply);
replyRoutes.get('/:commentId/replies', getReplies);
replyRoutes.put('/:commentId/replies/:replyId', verifyToken, editReply);
replyRoutes.delete('/:commentId/replies/:replyId', verifyToken, deleteReply);
replyRoutes.post('/:commentId/replies/:replyId/like', verifyToken, likeReply);
replyRoutes.post('/:commentId/replies/:replyId/dislike', verifyToken, dislikeReply);

export default replyRoutes;
