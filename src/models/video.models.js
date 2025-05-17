import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Film & Animation",
        "Autos & Vehicles",
        "Music",
        "Pets & Animals",
        "Sports",
        "Travel & Events",
        "Gaming",
        "People & Blogs",
        "Comedy",
        "Entertainment",
        "News & Politics",
        "Howto & Style",
        "Education",
        "Science & Technology",
        "Nonprofits & Activism",
      ],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    views: {
      type: String,
      trim: true,
    },
    likes: {
      type: String,
      trim: true,
    },
    dislikes: {
      type: String,
      trim: true,
    },
  },
  { timestamps }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
