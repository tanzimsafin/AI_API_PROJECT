const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_User } = require('../config'); // Make sure this is correctly imported

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing. Please log in.' });
  }

  try {
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer token"
    const decoded = await jwt.verify(token, JWT_SECRET_User);
    
    req.user_Id = decoded._id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { userMiddleware };
  
///const User_Id = user._id;
//req.userId = User_Id;