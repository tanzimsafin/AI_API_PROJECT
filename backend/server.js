const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Email route
app.post("/send-email", (req, res) => {
    const { userEmail, coinName } = req.body;

    // Setup Nodemailer transporter (Gmail example)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com", // Replace with your Gmail
            pass: "your-email-password", // Replace with your App password
        },
    });

    // Email options
    const mailOptions = {
        from: "your-email@gmail.com",
        to: userEmail,
        subject: "Crypto Alert Notification",
        text: You clicked on ${coinName}! Stay tuned for more updates.,
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Email sent successfully!" });
        }
    });
});

app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});