

export const isUserDetails = async (req,res, next) =>{
    const {fullname, username, email, password} = req.body;

    if(!fullname || !username || !email || !password){
        res.status(404).json({message : "Input field required."})
    }
    next();
} 