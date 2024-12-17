const express = require('express');
const Router = express.Router;
const userRouter = Router();
const bcrypt=require('bcrypt');
const saltRounds=require('../config');
const {SignUpModel}=require('../schema');
const jwt = require('jsonwebtoken');
const {z}=require('zod');
const {JWT_SECRET_User}=require('../config');
const {userMiddleware}=require('../middleware/userMiddleware');
//------------------------------sign up end point----------------------
userRouter.post('/signup', async (req, res) => {
    const name=req.body.name;
    const email=req.body.email;
    const Password=req.body.Password;
    const DateOfBirth=req.body.DateOfBirth;
    const user={
        name:req.body.name,
        email:req.body.email,
        Password:req.body.Password,
        DateOfBirth:req.body.DateOfBirth
    }
 
    //input validation using zod
    const User_Schema = z.object({
        name: z.string().min(3, { message: "Name must have at least 3 letters" }),
        email: z.string().email({ message: "Invalid email address" }),
        Password: z.string().min(5, { message: "Password must be at least 5 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
        DateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    });
    //check format input format by safeparse
    const is_Valid_Input = User_Schema.safeParse(user);
    if (!is_Valid_Input.success) {
        return res.status(400).json(is_Valid_Input.error);
    }else{
        const hashed_Password= await bcrypt.hash(Password,parseInt(saltRounds));// hashed password using bcrypt 
       await SignUpModel.create({
         name,
         email,
         Password:hashed_Password,// replaced with hasdhed password
         DateOfBirth
     })
     res.send({message:'User is Signed Up'})
    }
    
});


//----------------------------SignIn----------------------------------------------------
//sign in end point 
userRouter.post('/signin', async (req, res) => {
    const email=req.body.email;
    const Password=req.body.Password;
    const result=await SignUpModel.findOne({
        email,
    })
    if(result){
        const User_Id=result._id;
        const hashed_Password=result.Password;
        const verify=await bcrypt.compare(Password,hashed_Password);//compare with Password and hash Password
        if(verify){
            const token = jwt.sign({ id:User_Id }, JWT_SECRET_User, { expiresIn: '1h' });
            res.json({message:`User is SignedIn `,"auth":true, "token":token});
        }else{
           res.send({message:'Sorry Wrong Password!'});
        }
    }
   else{
    res.send({message:'Error ! Wrong credentials'})
   }
});

//--------------------------Forgot PassWord------------------------------
//forget Password Option 
userRouter.post('/forgetPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await SignUpModel.findOne({ email });
        if (user) {
            // If email exists, return a success response
            res.json({ exists: true, message: 'Email verified' });
        } else {
            // If email does not exist, return false
            res.json({ exists: false, message: 'Email not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

userRouter.put('/forgetPassword', async (req, res) => {
    const { email, Password } = req.body;
    const user={
        email:req.body.email,
        Password:req.body.Password,
    }
    //input validation using zod
    const User_Schema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        Password: z.string().min(5, { message: "Password must be at least 5 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    });
    //check format input format by safeparse
    
    const is_Valid_Input = User_Schema.safeParse(user);
    if (!is_Valid_Input.success){
       res.json({ message: 'Invalid input format' });
    }else{
        try {
            const user = await SignUpModel.findOne({ email });
            if (user) {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(Password, parseInt(saltRounds));
                
                // Update user's password
                await SignUpModel.findOneAndUpdate(
                    { email },
                    { Password: hashedPassword }
                );
    
                res.json({ message: 'Password successfully updated' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating password' });
        }

    }
 
});
// Verify Token Route
userRouter.get('/verify-token', userMiddleware, (req, res) => {
    // If the middleware passes, the token is valid
    res.json({ 
      valid: true, 
      user_Id: req.user_Id 
    });
  });
//---------------------------------Market-------------------------------
userRouter.get('/market', userMiddleware, async (req, res) => {
    res.json({ message: 'Market data retrieved' });
});
userRouter.get('/crypto', userMiddleware, async (req, res) => {
    res.json({ message: 'Crypto data retrieved' });
});

module.exports = {
userRouter:userRouter
};
