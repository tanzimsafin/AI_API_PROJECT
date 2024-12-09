const express = require('express');
const Router = express.Router;
const userRouter = Router();
const bcyrpt=require('bcrypt');
const saltRounds=require('../config');
const {SignUpModel}=require('../schema');
const jwt = require('jsonwebtoken');
const {zod}=require('zod');
//sign up end point
userRouter.post('/signup', async (req, res) => {
    const name=req.body.name;
    const email=req.body.email;
    const Password=req.body.Password;
    const DateOfBirth=req.body.DateOfBirth
    const hashed_Password= await bcyrpt.hash(Password,parseInt(saltRounds));// hashed password using bcrypt 
    await SignUpModel.create({
        name,
        email,
        Password:hashed_Password,// replaced with hasdhed password
        DateOfBirth
    })
    res.send('User is Signed Up')
});
//sign in end point 
userRouter.get('/signin', async (req, res) => {
    const email=req.body.email;
    const Password=req.body.Password;
    const result=await SignUpModel.findOne({
        email,
    })
    if(result){
        const verify= await bcyrpt.compare(Password,result.Password);//compare with Password and hash Password
        if(verify){
            res.send({message:`User is SignedIn ${result}`});
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