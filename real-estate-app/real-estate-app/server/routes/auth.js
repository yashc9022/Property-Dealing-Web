const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SIGNUP route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received Signup Data:", req.body);

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 👉 Pass plain password (hashing will be done by User model's pre-save hook)
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    console.log("✅ User saved to DB:", savedUser);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("❌ Signup failed:", error.message);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received Login Data:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    console.log("🔍 User found in DB:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
