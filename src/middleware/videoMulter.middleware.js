import multer from "multer";
import { extname } from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const ext = extname(file.originalname).toLowerCase();
  
  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 500 // 500MB
};

const videoUploadMiddleware = multer({ 
  storage, 
  fileFilter, 
  limits 
}).single('video');

export { videoUploadMiddleware };