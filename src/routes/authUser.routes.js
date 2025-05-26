import express from "express";
import {createUser, loginUser,profileUpload} from "../controllers/user.controllers.js"
import { userValidation } from "../validation/user.validation.js";
import { profileUploadMiddleware } from "../middleware/multer.middleware.js";
import verifyToken from "../utils/verification.utils.js";



const userRouter = express.Router();


userRouter.post("/create",userValidation,  createUser);
userRouter.post("/login",loginUser)
userRouter.post('/profile-upload', verifyToken, profileUploadMiddleware,  profileUpload);



export default userRouter;