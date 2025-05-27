import express from "express"
import verifyToken from "../utils/verification.utils.js";
import {videoUploadMiddleware } from "../middleware/videoMulter.middleware.js";
import { uploadVideo,getAllVideos,getShorts } from "../controllers/video.controllers.js";


const videoRoutes = express.Router()


videoRoutes.post("/upload-video", verifyToken, videoUploadMiddleware,uploadVideo);
videoRoutes.get("/videos", getAllVideos);
videoRoutes.get("/shorts",getShorts)




export default videoRoutes;