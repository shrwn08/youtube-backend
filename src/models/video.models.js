import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
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
    videoUrl : {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps : true}
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
