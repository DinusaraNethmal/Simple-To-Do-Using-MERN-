const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // 2. Scramble (Hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a random 6-digit code (we will email this later)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save User to Database
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode: code
    });

    await newUser.save();
    await sendEmail(email, code);
    res.status(201).json({ msg: "User registered! Please verify your email." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY ROUTE
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // 3. Compare the code sent by the user with the code in the DB
    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid or expired code" });
    }

    // 4. Success! Update the user
    user.isVerified = true;
    user.verificationCode = undefined; // Remove the code since it's used
    await user.save();

    res.status(200).json({ msg: "Email verified successfully! You can now login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during verification" });
  }
});

const jwt = require("jsonwebtoken"); // Add this import at the top of authRoutes.js

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // 2. Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    // 3. Check password (Compare plain password with hashed password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 4. Create "Digital Key" (JWT Token)
    const token = jwt.sign({ id: user._id }, "my_secret_key", { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;