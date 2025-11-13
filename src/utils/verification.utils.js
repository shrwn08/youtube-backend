import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("authHeader", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "unauthorized, token is missing",
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.ACCESS_SECRET_TOKEN;

  try {
    const decoded = jwt.verify(token, secret);
   
    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    console.error("Token verification error: ", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Session expired",
        code: "TOKEN_EXPIRED",
      });
    }
    res.status(403).json({ message: "forbidden, invalid token" });
  }
};

export default verifyToken;
