import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDB.js";
import userRouter from "./routes/authUser.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());


connectDb()

app.get("/", (req,res) =>{
    res.send("hello world")
})

app.use("/api/auth", userRouter);
// app.use("/api/", )



app.listen(port, ()=> console.log("server is running on port", port))



