const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission and send email
app.post('/', async (req, res) => {
    const { user, email, message } = req.body;

    console.log('User:', user);
    console.log('Email:', email);
    console.log('Message:', message);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Load from .env
            pass: process.env.EMAIL_PASS, // Load from .env
        },
    });

    // Email options
    const mailOptions = {
        from: email, // Always use your own email
        to: process.env.EMAIL_USER,   // Your personal email to receive messages
        subject: `Message from ${user}`,
        text: `Name: ${user}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.redirect('#contact'); // Redirect back to the homepage
    } catch (error) {
        console.error('Error sending email:', error.stack);
        res.status(500).send('Failed to send email');
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running at http://localhost:5000');
});
