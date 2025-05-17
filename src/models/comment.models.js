import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : String,
        trim : true,
        required : true,
    },

},
    {timestamps : true}
)

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;