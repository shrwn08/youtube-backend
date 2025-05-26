import multer from "multer";


const storage = multer.memoryStorage();

const filesFilter = (req, file, cb) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];

    const extValid = validTypes.includes(file.originalname);

    const mimeValid = validTypes.includes(file.mimetype);

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        cb(new Error('Only mp4/quicktime/webm videos allowed'));
    }
}



const uploadvideo = multer({
    storage,
    limits: {
        fileSize: 200*1024*1024
    },
    filesFilter
})

export const videoUpload = uploadvideo.single('video');

export default uploadvideo;