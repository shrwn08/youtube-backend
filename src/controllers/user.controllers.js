import User from "../models/user.models.js";
import { profileUploadMiddleware } from "../middleware/multer.middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config()

export const createUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const isUserExisted = await User.findOne({
      $or: [{ username }, { email }],
    });

    // console.log("isUserExisted= ", isUserExisted);
    if (isUserExisted) {
      return res
        .status(409)
        .json({ message: "username or email already existed" });
    }
    const user =await User.create({ fullname, username, email, password });

    await user.save();

    const userRes = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.status(201).json({ message: "user created", user: userRes });
  } catch (error) {
    res.status(500).json({ message: "There is a server error." });
  }
};


export const loginUser = async (req,res) =>{
    const {email, password} = req.body;

    

    try {
        if(!email || !password){
            return res.status(400).json({message : "invalid input"})
        }

        const user = await User.findOne({email});

      
        
        if(!user){
            return res.status(404).json({message : "Invalid Credential"});
        }

        const isMatched = await user.comparePassword(password);


        if(!isMatched){
                return res.status(404).json({message : "Invalid Credential"});
        }


       const userRes = {id : user._id, email : user.email}

       const payload = {userId : user._id};
       const secret = process.env.ACCESS_SECRET_TOKEN;
       const expiry = {expiresIn:process.env.EXPIRY_SECRET_TOKEN};

       const token = jwt.sign(payload, secret, expiry);

       res.status(200).json({message : "user login successfully", token,user :  userRes});

    } catch (error) {
        res.status(500).json({message:"server error"});
    }
}


export const profileUpload = async (req, res)=>{
    const {id} = req.params;

    if(!id){
        return res.status(400).json({message : "invalid id "});
    }

    try {
        profileUploadMiddleware(req, res, async(err)=>{
            if(err){
                return res.status(400).json({message : err.message})
            }
    
            if(!req.file){
                return res.status(400).json({message : "No file uploaded"})
            }
    
            const avatarPath = req.file.path;
            const user = await User.findByIdAndUpdate(id,{avatar : avatarPath});
    
            if(!user){
                return res.status(404).json({message : "user not founded"})
            }
    
            const userRes = {id : user._id, email : user.email}
    
            res.status(200).json({message : "profile image upload successfully", user : userRes})
    
        })
    } catch (error) {
        res.status(500).json({message : "Server error",
            error : error.message
        });
    }

}