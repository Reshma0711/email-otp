const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const { dbConnect } = require("./config");
dbConnect();

const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

let otpStore = {}; // In-memory store { email: { otp, expiresAt } }

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com', // Ensure correct host
    secure:false,
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // App password
    },
    tls:{
        rejectUnauthorized: false
    }
  });
  
// Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
  
    otpStore[email] = { otp, expiresAt };
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to send email',msg:err.message });
    }
  });
  
  // Verify OTP
  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
  
    if (!record) return res.status(400).json({ success: false, message: 'OTP not found' });
  
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
  
    if (record.otp === otp) {
      delete otpStore[email];
      res.json({ success: true, message: 'OTP verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
