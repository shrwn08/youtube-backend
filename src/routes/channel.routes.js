import express from "express";
import { createChannel } from "../controllers/channel.controllers.js";
import { profileUploadMiddleware } from "../middleware/multer.middleware.js";
import verifyToken from "../utils/verification.utils.js";

const channelRouter = express.Router();
 channelRouter.post("/:id/create-channel",
    verifyToken,
  (req, res, next) => {
    console.log("Channel creation route hit");
    next();
  },
  profileUploadMiddleware,
  createChannel
);

export default channelRouter;