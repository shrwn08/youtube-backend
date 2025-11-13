import express from "express";
import verifyToken from "../utils/verification.utils.js";
import { videoUploadMiddleware } from "../middleware/videoMulter.middleware.js";
import { 
  uploadVideo,
  getAllVideos,
  getShorts,
  confirmUploadCompletion 
} from "../controllers/video.controllers.js";
import { cleanupFailedUpload } from "../middleware/cleanup.middleware.js";

const videoRoutes = express.Router();

videoRoutes.post('/upload',
  verifyToken,
  videoUploadMiddleware,
  uploadVideo,
  cleanupFailedUpload // Error handling middleware
);

videoRoutes.post('/:videoId/complete',
  verifyToken,
  confirmUploadCompletion
);

videoRoutes.get("/videos", getAllVideos);
videoRoutes.get("/shorts", getShorts);

export default videoRoutes;