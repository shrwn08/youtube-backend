// user.controller.js

import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import profileUploadToCloudinary from "../middleware/profileCloudinary.middleware.js";
import fs from "fs";
import path from "path";
import { log } from "console";

// Load environment variables
dotenv.config();

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    
    // Check if user already exists with same username or email
    const isUserExisted = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExisted) {
      return res
        .status(409)
        .json({ message: "username or email already existed" });
    }

    // Create new user
    const user = await User.create({ fullname, username, email, password });
    await user.save();

    // Prepare response without sensitive data
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

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credential" });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(404).json({ message: "Invalid Credential" });
    }

    const userRes = {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isChannel: user.isChannel,
    };

    const payload = { userId: user._id };
    const secret = process.env.ACCESS_SECRET_TOKEN;
    const expiry = { expiresIn: process.env.EXPIRY_SECRET_TOKEN };
    const token = jwt.sign(payload, secret, expiry);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    });

    return res.status(200)
      .json({ message: "User login successfully", token, user: userRes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile picture
export const profileUpload = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await profileUploadToCloudinary(req.file);

    // Get user ID from authenticated request
    const id = req.user.userId;

    // Update user's avatar in database
    const user = await User.findByIdAndUpdate(
      id,
      {
        avatar: result.secure_url,
        avatarPublicId: result.public_id,
      },
      { new: true } // Return updated document
    );

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare response
    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: {
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
        isChannel: user.isChannel,
      },
    });
  } catch (error) {
    console.error("upload error: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current logged-in user's data
export const getCurrentUser = async (req, res) => {
  try {
    // Find user by ID from authenticated request, exclude password
    const user = await User.findById(req.user.userId).select("-password");

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
