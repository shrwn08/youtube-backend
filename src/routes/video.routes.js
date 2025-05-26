import express from "express"
import verifyToken from "../utils/verification.utils.js";
import { videoUpload } from "../middleware/videoMulter.middleware.js";
import { uploadVideo } from "../controllers/video.controllers.js";


const videoRoutes = express.Router()


videoRoutes.post("/upload-video", verifyToken, videoUpload,uploadVideo);




export default videoRoutes;