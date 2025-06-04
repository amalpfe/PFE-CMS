const pool = require("../../config"); // your MySQL pool
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existingUser] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO user (email, passwordHash, role) VALUES (?, ?, ?)", 
      [email, passwordHash, role]
    );

    // Return inserted user ID and other info if you want
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: result.insertId 
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Incoming login request:", req.body); // 👈 add this line

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [result] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      role: user.role,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error", error: err });
  }
};


exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM doctor WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const doctor = rows[0];

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
  { id: doctor.id, role: 'Doctor' }, // role must match what the middleware expects
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);
  // Optionally generate JWT here
  res.status(200).json({
  token,
  role: 'Doctor',
  message: 'Doctor logged in successfully',
  doctor
});

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

