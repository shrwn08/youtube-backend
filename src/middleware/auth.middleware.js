import jwt from "jsonwebtoken";
import dotenv from "jsonwebtoken" ;
import User from "../models/user.models.js"
dotenv.config();



const verifyToken = async (req,res,next) =>{
    const authHeader = req.headers.authorization;

    console.log("authHeader",authHeader);
    

    if(!authHeader || !authHeader.startwith("Bearer")){
        return res.status(401).json({
            message : "unauthorized, token is missing"
        })
    }

    const token  = authHeader.split(" ")[1];

    const  secret = process.env.ACCESS_SECRET_TOKEN;

    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId).select("-passsword")

        if(!user){
            return res.status(404).json({message : "user not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error: ', error.message)
        res.status(403).json({message : "forbidden, invalid token"})
    }
}

export default verifyToken;