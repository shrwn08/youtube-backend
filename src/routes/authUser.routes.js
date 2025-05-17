import express from "express";
import {createUser, loginUser} from "../controllers/user.controllers.js"
import { userValidation } from "../validation/user.validation.js";

const userRouter = express.Router();

userRouter.post("/create",userValidation,  createUser);
userRouter.post("/login",loginUser)



export default userRouter;