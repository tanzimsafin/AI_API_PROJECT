const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_User } = require('../config'); // Make sure this is correctly imported

async function userMiddleware(req, res, next) {
  const authHeader = req.headers["x-access-token"];
  
  // Check if the token is missing
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing. Please log in.' });
  }

  try {
    // Extract token from "Bearer token"
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = await jwt.verify(token, JWT_SECRET_User);
    req.user_Id = decoded._id; // Add user ID to request object

    next(); // Allow the request to continue

  } catch (err) {
    // Specific error handling for expired token
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired. Please log in again.' });
    }
    
    // General error handling
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { userMiddleware };
