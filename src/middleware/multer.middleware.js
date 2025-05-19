import multer from "multer";
import path from "path"

    
const storage = multer.diskStorage({
    destination :function(req,file, cb){
        cb(null, "../../public/temp/profile-img")
    },
    filename : function(req,file,cb){
            const suffix = Date().now+ "-"+Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, "profile-"+suffix+ext);
    }
})

//file filter like jpge, jpg, png

const fileFilter = (req, file, cb)=>{
    const fileTypes =/jpge|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images only!'), false);
  }

}


//initialize the multer
const upload = multer({
    storage ,
    limits  : {
        fileSize : 5 * 1024 * 1024
    },
    fileFilter 
});

console.log(upload);
export const profileUploadMiddleware = upload.single('avatar');

export default upload;