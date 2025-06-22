import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try {
        // Validate connection string
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI, );
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error("Failed to connect to database", error.message);
        process.exit(1); // Exit process with failure
    }
}

export default connectDb;
