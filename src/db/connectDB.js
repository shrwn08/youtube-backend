import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDb = async () => {
    // console.log(process.env.MONGODB_URI)
    try {
        
        await  mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error("Failed to connected database", error);
    }
}

export default connectDb;