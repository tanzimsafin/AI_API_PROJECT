const express = require('express');
const Router = express.Router;
const userRouter = Router();
// const bcyrpt=require('bcrypt');
const {SignUpModel}=require('../schema');
//const jwt = require('jsonwebtoken');
//const {zod}=require('zod');
userRouter.post('/signup', async (req, res) => {
    const name=req.body.name;
    const email=req.body.email;
    const Password=req.body.Password;
    const DateOfBirth=req.body.DateOfBirth
    await SignUpModel.create({
        name,
        email,
        Password,
        DateOfBirth
    })
    res.send('User is Signed Up')
});
userRouter.get('/signin', async (req, res) => {
    const email=req.body.email;
    const Password=req.body.Password;
    const result=await SignUpModel.findOne({
        email,
        Password
    })
    if(result){
        res.send({message:`User is SignedIn ${result}`})
    }
   else{
    res.send('Error ! Wrong credentials')
   }
});
module.exports = {
    userRouter:userRouter
};