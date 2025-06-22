import multer from "multer";


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];

     if (validTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only MP4, QuickTime, or WebM videos allowed'), false);
    }
}



const uploadvideo = multer({
    storage,
    limits: {
        fileSize: 200*1024*1024
    },
    fileFilter
})

export const videoUploadMiddleware = uploadvideo.single('video');

export default uploadvideo;