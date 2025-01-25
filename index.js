const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'docs')));

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Handle form submission and send email
app.post('/', async (req, res) => {
    const { user, email, message } = req.body; 
    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Use 465 for SSL or 587 for TLS
        secure: false, // Set to true if using port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    

    // Email options
    const mailOptions = {
        from: email, 
        to: process.env.EMAIL_USER,   // Your personal email to receive messages
        subject: `Message from ${user}`,
        text: `Name: ${user}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.redirect('#contact');  
    } catch (error) {
        console.error('Error sending email:', error.stack);
        res.status(500).send('Failed to send email');
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running at http://localhost:5000');
});
