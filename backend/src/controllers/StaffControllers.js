const db = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Make sure it's defined in your .env file

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    // استعلام عن الموظف عبر الإيميل
    const [rows] = await db.execute("SELECT * FROM staff WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff not found." });
    }

    const staff = rows[0];

    // المقارنة باستخدام bcrypt
    // const isMatch = await bcrypt.compare(password, staff.passwordHash);

    // لو حابب تجربة بدون تشفير مؤقتًا (غير مستحسن للأمان)، استخدم:
    const isMatch = (password === staff.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { id: staff.id, role: "Staff", username: staff.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // استبعاد كلمة السر من البيانات التي نرسلها للعميل
    const { passwordHash, ...staffData } = staff;

    res.status(200).json({
      message: "Login successful",
      token,
      staff: staffData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
