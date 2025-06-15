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
    const isMatch = await bcrypt.compare(password, staff.passwordHash);
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

exports.getTotalAppointmentsToday = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointment WHERE DATE(appointmentDate) = CURDATE()"
    );
    res.json({ totalAppointmentsToday: rows[0].count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCheckedInPatients = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointment WHERE appointmentStatus = 'Completed' AND DATE(appointmentDate) = CURDATE()"
    );
    res.json({ checkedInPatients: rows[0].count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM billing WHERE paymentStatus = 'Pending'"
    );
    res.json({ pendingPayments: rows[0].count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUpcomingAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointment WHERE appointmentDate > NOW()"
    );
    res.json({ upcomingAppointments: rows[0].count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAvailableDoctors = async (req, res) => {
  try {
    // Join doctoravailability with doctors table to get doctor name
    const [rows] = await db.execute(`
      SELECT 
        da.id,
        da.doctorId,
        d.firstName,
        d.lastName,
        da.dayOfWeek,
        da.startTime,
        da.endTime
      FROM doctoravailability da
      JOIN doctor d ON da.doctorId = d.id
    `);

    // Format the name as "First Last"
    const doctorAvailability = rows.map(row => ({
      id: row.id,
      doctorId: row.doctorId,
      doctorName: `${row.firstName} ${row.lastName}`,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
    }));

    res.json({ doctorAvailability });
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
