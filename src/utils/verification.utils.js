import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODJmNDcxOTEzM2FlMGI2NmYzNmQwMTYiLCJpYXQiOjE3NDgyODY0NjIsImV4cCI6MTc0ODM3Mjg2Mn0.3P3qHsyxrZyVnwCgPSPw71ZMDZ-GW4MCOTWOx6Mo1-E";
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') ;
    if (!token) return res.status(401).json({ error: 'No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        // console.log(decoded);
        
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
}

export default verifyToken;