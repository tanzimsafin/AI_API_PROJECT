const express = require('express');
const Router = express.Router;
const userRouter = Router();
const bcrypt=require('bcrypt');
const saltRounds=require('../config');
const {SignUpModel}=require('../schema');
const jwt = require('jsonwebtoken');
const {z}=require('zod');
const {JWT_SECRET_User}=require('../config');
//sign up end point
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
     res.send('User is Signed Up')
    }
    
});


//-----------------------------------------------------------------------------------
//sign in end point 
userRouter.get('/signin', async (req, res) => {
    const email=req.body.email;
    const Password=req.body.Password;
    const result=await SignUpModel.findOne({
        email,
    })
    const User_Id=result._id;
    const hashed_Password=result.Password;  
    if(result){
        const verify=bcrypt.compare(Password,hashed_Password);//compare with Password and hash Password
        if(verify){
            const token=jwt.sign({id:User_Id},JWT_SECRET_User);
            res.json({message:`User is SignedIn `, "token":token});
        }else{
           res.send('Sorry Wrong Password!');
        }
    }
   else{
    res.send('Error ! Wrong credentials')
   }
});
module.exports = {
    userRouter:userRouter
};
