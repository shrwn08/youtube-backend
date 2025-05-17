import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

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

        
       user.password = null;

       res.status(200).json({message : "user login successfully", user})

    } catch (error) {
        res.status(500).json({message:"server error"})
    }
}
