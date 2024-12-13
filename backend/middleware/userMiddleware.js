const express=require('express');
const {JWT_SECRET_User}=require;
const jwt=require('jsonwebtoken');
async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer token"
    await jwt.verify(token, JWT_SECRET_User, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    const User_Id = user._id;
    req.userId = User_Id;
    next();
    });
  } else {
    res.status(401).json({ message: 'Token missing. Please log in.' });
  }
  }
  module.exports = {userMiddleware};