const express = require('express');
const cors = require('cors');
const emailRoutes = require('./emailRoutes'); // Import the email routes

const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // For parsing application/json

// Use the email routes for handling email-related requests
app.use('/api', emailRoutes); // All routes from emailRoutes will start with /api

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
