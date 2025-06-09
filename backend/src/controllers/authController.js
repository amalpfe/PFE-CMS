const db = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admin WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

const loginDoctor = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM doctor WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const doctor = results[0];
    const match = await bcrypt.compare(password, doctor.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor.id, role: 'doctor' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

// ✅ Export as object
module.exports = {
  login,
  loginDoctor
};
