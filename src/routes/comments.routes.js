import express from 'express';
import { updateComment , getComments} from '../controllers/comments.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const commentRoutes = express.Router();



commentRoutes.post('/:videoId/comments', verifyToken ,updateComment);
commentRoutes.get('/:videoId/comments', getComments);


export default commentRoutes;