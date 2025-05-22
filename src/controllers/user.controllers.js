import User from "../models/user.models.js";
import { profileUploadMiddleware } from "../middleware/multer.middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from 'fs';
import path from "path"

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

// userController.js - FIXED VERSION
export const profileUpload = async (req, res) => {
  const { id } = req.params;

  try {
    // Multer already processed file via middleware - no need to call again
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Normalize path for Windows/Linux compatibility
    const avatarPath = req.file.path.replace(/\\/g, "/");
    
    const user = await User.findByIdAndUpdate(
      id,
      { avatar: avatarPath },
      { new: true } // Return updated document
    );

    if (!user) {
      fs.unlinkSync(avatarPath);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: { id: user._id, email: user.email },
      avatarUrl: `/temp/profile-img/${path.basename(avatarPath)}` // Public URL
    });

  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};
