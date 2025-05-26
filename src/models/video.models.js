import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    userId: { 
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
    videoURL : {
      type: String,
      required: true,
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
  { timestamps : true}
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
