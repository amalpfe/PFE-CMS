
const axios = require('axios'); 
const { validationResult } = require('express-validator');// controllers/signupController.js
const bcrypt = require('bcryptjs');
const pool = require('../../config'); // Assuming your MySQL pool is configured in config.js
const jwt = require('jsonwebtoken');
// Handle user signup
const handleSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Simple validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill out all required fields." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if email already exists
    const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.execute(
      'INSERT INTO user (username, passwordHash, email, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, hashedPassword, email, 'Patient', 'Active']
    );

    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

//Handle user login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // تحقق من وجود المستخدم
    const [user] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const foundUser = user[0];

    // تحقق من كلمة السر
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // إنشاء توكن
    const token = jwt.sign(
      { id: foundUser.id, role: foundUser.role },
      "SECRET_KEY", // بدّك تغيّرها ببيئة الإنتاج
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleSignup,
  handleLogin
};
