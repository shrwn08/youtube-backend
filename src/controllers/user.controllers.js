import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import profileUploadToCloudinary from "../middleware/profileCloudinary.middleware.js";
import fs from 'fs';
import path from "path"
import { log } from "console";

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const isUserExisted = await User.findOne({
      $or: [{ username }, { email }],
    });

    // console.log("isUserExisted= ", isUserExisted);
    if (isUserExisted) {
      return res
        .status(409)
        .json({ message: "username or email already existed" });
    }
    const user = await User.create({ fullname, username, email, password });

    await user.save();

    const userRes = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.status(201).json({ message: "user created", user: userRes });
  } catch (error) {
    res.status(500).json({ message: "There is a server error." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "invalid input" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credential" });
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res.status(404).json({ message: "Invalid Credential" });
    }

    const userRes = { id: user._id, email: user.email };

    const payload = { userId: user._id };
    const secret = process.env.ACCESS_SECRET_TOKEN;
    const expiry = { expiresIn: process.env.EXPIRY_SECRET_TOKEN };

    const token = jwt.sign(payload, secret, expiry);

    res
      .status(200)
      .json({ message: "user login successfully", token, user: userRes });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};


export const profileUpload = async (req, res) => {

  

  try {
    if(!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await profileUploadToCloudinary(req.file);

    const  id  = req.user.userId;

    const user = await User.findByIdAndUpdate(
      id,
      { avatar: result.secure_url, avatarPublicId: result.public_id },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile image uploaded successfully", user : {
      _id: user._id,
      email: user.email,
      avatar: user.avatar,
    } });
  } catch (error) {
    console.error('upload error: ', error.message);

    res.status(500).json({ message: "Server error", error: error.message });
    
  }
};


