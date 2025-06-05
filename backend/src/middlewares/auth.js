const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // استخرج التوكن من هيدر Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // فك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ضع بيانات المستخدم في req.user (مثلاً id)
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
