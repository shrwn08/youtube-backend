import multer from "multer";
// import path from "path";

// import fs from "fs";

// Ensure upload directory exists
// const ensureUploadsDirExists = (dirPath) => {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(process.cwd(), "public", "temp", "profile-img");
//     // const uploadDir = "../../public/temp/profile-img"
//     ensureUploadsDirExists(uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, "profile-" + suffix + ext);
//   },
// });

// //file filter like jpge, jpg, png

// fileFilter: (req, file, cb) => {
//     const validTypes = /jpe?g|png/i;
//     const extValid = validTypes.test(path.extname(file.originalname));
//     const mimeValid = validTypes.test(file.mimetype);
    
//     if (extValid && mimeValid) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only JPEG/PNG images allowed'));
//     }
//   }

// //initialize the multer
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
//   files : 1,
// });

// // console.log(upload);
// export const profileUploadMiddleware = upload.single("avatar");

// export default upload;


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