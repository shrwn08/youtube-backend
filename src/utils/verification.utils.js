import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  console.log("Verifying token...");
  // const token = req.header('Authorization').replace("Bearer ", "");
  const token = req.header('Authorization').replace("Bearer ", "")
  console.log("token from verifyToken line 10",token)
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log("Token verified for user:", decoded.userId);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export default verifyToken;