const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Define the email sending route
router.post('/send-email', (req, res) => {
    const { subject, to, body, from, appPassword } = req.body; // Include sender email and app password

    // Create the transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,       // Sender email
            pass: appPassword // App password
        },
    });

    const mailOptions = {
        from: from, // Sender email
        to: to,     // Recipient email
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
        res.status(200).json({ message: 'Email sent successfully', info: info.response });
    });
});

module.exports = router;
