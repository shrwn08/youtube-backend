import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = () => {
    // Validate connection string
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        process.exit(1);
    }

    const db = mongoose.connection;

    // Event listeners
    db.on('error', (error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });

    db.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    db.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    // Initiate connection
    mongoose.connect(process.env.MONGODB_URI);
}

export default connectDb;