const express = require('express');
const Router = express.Router;
const userRouter = Router();
const bcrypt = require('bcrypt');
const { SignUpModel } = require('../schema.js');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { JWT_SECRET_User } = require('../config');
const { userMiddleware } = require('../middleware/userMiddleware');
const axios = require('axios');  // You need to install axios

// Sign up endpoint
userRouter.post('/signup', async (req, res) => {
    console.log("request received");

    const { name, email, password, dateOfBirth } = req.body;

    const user = {
        name,
        email,
        password,
        DateOfBirth: dateOfBirth
    };

    // Input validation using zod
    const User_Schema = z.object({
        name: z.string().min(3, { message: "Name must have at least 3 letters" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password must be at least 5 characters long" }),
        DateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    });

    // Validate input
    const is_Valid_Input = User_Schema.safeParse(user);
    if (!is_Valid_Input.success) {
        return res.status(400).json(is_Valid_Input.error);
    }

    try {
        // Save user to database
        await SignUpModel.create({
            name,
            email,
            Password: password, 
            DateOfBirth: dateOfBirth
        });

        res.send({ message: 'User is Signed Up' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            res.status(400).json({ message: "Duplicate entry. Please check your details." });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// Sign in endpoint
userRouter.post('/signin', async (req, res) => {
    const email = req.body.email;
    const oldPassword = String(req.body.Password).trim();

    try {
        const result = await SignUpModel.findOne({ email });

        if (result) {
            if (oldPassword === result.Password) {
                const token = jwt.sign({ id: result._id }, JWT_SECRET_User, { expiresIn: '1h' });
                return res.json({ message: `User is SignedIn`, auth: true, token });
            } else {
                return res.status(401).json({ message: 'Wrong Password!' });
            }
        } else {
            return res.status(404).json({ message: 'Error! User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Forgot password endpoint
userRouter.post('/forgetPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await SignUpModel.findOne({ email });
        if (user) {
            res.json({ exists: true, message: 'Email verified' });
        } else {
            res.json({ exists: false, message: 'Email not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update password endpoint
userRouter.put('/forgetPassword', async (req, res) => {
    const { email, Password } = req.body;

    const user = {
        email: req.body.email,
        Password: req.body.Password,
    };

    const User_Schema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        Password: z.string().min(5, { message: "Password must be at least 5 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    });

    const is_Valid_Input = User_Schema.safeParse(user);
    if (!is_Valid_Input.success) {
        res.json({ message: 'Invalid input format' });
    } else {
        try {
            const user = await SignUpModel.findOne({ email });
            if (user) {
                const hashedPassword = await bcrypt.hash(Password, 10);
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

// Fetch top cryptocurrency price
userRouter.get('/crypto', userMiddleware, async (req, res) => {
    try {
        // Fetch data from CoinRanking API or another crypto API
        const response = await axios.get('https://api.coinranking.com/v2/coins', {
            headers: {
                'x-access-token': 'your-api-key-here',
            },
        });

        const coins = response.data.data.coins;

        // Find the coin with the highest price
        const topCoin = coins.reduce((prev, current) => (prev.price > current.price ? prev : current));

        // Send the response with the top coin information
        res.json({
            name: topCoin.name,
            symbol: topCoin.symbol,
            price: topCoin.price,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching crypto data' });
    }
});

// Get user profile endpoint
userRouter.get('/profile', userMiddleware, async (req, res) => {
    const userId = req.user.id;  // Assuming JWT token has user id in it

    try {
        const user = await SignUpModel.findById(userId).select('-Password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);  // Send the user profile details
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Update user profile endpoint
userRouter.put('/profile', userMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { name, email, DateOfBirth } = req.body;

    const userSchema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        DateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
    });

    const is_Valid_Input = userSchema.safeParse({ name, email, DateOfBirth });
    if (!is_Valid_Input.success) {
        return res.status(400).json(is_Valid_Input.error);
    }

    try {
        const updatedUser = await SignUpModel.findByIdAndUpdate(
            userId,
            { name, email, DateOfBirth },
            { new: true }
        );
        res.json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

module.exports = {
    userRouter: userRouter
};
