import joi from "joi";



export const userValidation = (req, res, next) =>{
    const userSchema = joi.object({
   fullname: joi.string()
        .min(2)
        .max(20)
        .required()
        .trim()
        .pattern(/^[a-zA-Z\s]+$/)
        .message('Fullname should only contain letters and spaces'),
    username: joi.string()
        .min(3)
        .max(30)
        .required()
        .trim()
        .lowercase()
        .pattern(/^[a-z0-9_]+$/)
        .message('Username can only contain letters, numbers and underscores'),
    email : joi.string().email().required().trim().lowercase(),
     password: joi.string()
     .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .message("Password must contain at least one lowcase, one Uppercase, one Number and one special")


});



const {error, value} = userSchema.validate(req.body);

if(error){
    return res.status(400).json({
        message : "user validation failed",
        errors : error.details.map(err=>({
            field : err.path[0],
            messages : err.message
        }))
    })
}

req.body = value;
next();
}
