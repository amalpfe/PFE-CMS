const db = require('../../config');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Handle Login without token
const HandleLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Only Admins can log in here' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ? AND role = ?', [email, role]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or role' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Response without token
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  HandleLogin
};
