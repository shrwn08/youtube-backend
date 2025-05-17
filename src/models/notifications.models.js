import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    message : "subscribed you.",
    read : false,

},{timestamps : true});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;