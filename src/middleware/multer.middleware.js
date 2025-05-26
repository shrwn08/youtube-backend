import multer from "multer";


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const validTypes = /jpeg|jpg|png/i;

  const extValid = validTypes.test(file.originalname);

  const mimeValid = validTypes.test(file.mimetype);


  if(mimeValid && extValid) { 
    cb(null, true);
  }else {
    cb(new Error('Only JPEG, JPG, PNG images are allowed.'));
  }


}
const upload = multer({
  storage,
  limits: {fileSize: 5 * 1024 * 1024},
  fileFilter
})




export const profileUploadMiddleware = upload.single('avatar');

export default upload;