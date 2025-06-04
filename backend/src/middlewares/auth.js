const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    console.log("Decoded JWT:", decoded); // 👈 add this for debugging

    req.user = decoded;
    next();
  });
};


