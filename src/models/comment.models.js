import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
      videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    content : {
        type : String,
        trim : true,
        required : true,
    },
     replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]

},
    {timestamps : true}
)

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;