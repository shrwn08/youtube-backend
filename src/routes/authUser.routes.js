import express from "express";
import {createUser, loginUser} from "../controllers/user.controllers.js"
import { userValidation } from "../validation/user.validation.js";
import multer from "multer"


const userRouter = express.Router();

const upload = multer({ dest: '' })

userRouter.post("/create",userValidation,  createUser);
userRouter.post("/login",loginUser)
userRouter.put("/upload-profile", upload.single('avatar'), )



export default userRouter;