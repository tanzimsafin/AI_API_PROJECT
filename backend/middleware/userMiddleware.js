const express=require('express');
const {JWT_SECRET_User}=require;
const jwt=require('jsonwebtoken');
function userMiddleware(req,res,next){
    const token=req.headers.token;
    const verify=jwt.verify(token,JWT_SECRET_User);
    if(verify){
        req.userId=verify.id;
        next();
    }else{
        res.json({message:"You are not signed In!"})
    }
}