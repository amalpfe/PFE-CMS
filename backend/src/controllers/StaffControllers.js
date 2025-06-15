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


// Create appointment
exports.getDoctorAvailability = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT id, dayOfWeek, startTime, endTime
       FROM doctoravailability
       WHERE doctorId = ?`,
      [doctorId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor availability' });
  }
};


// Get all appointments (optional filters: patientId, doctorId, status)
exports.getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;

    let query = `
      SELECT 
        a.*, 
        CONCAT(p.firstName, ' ', p.lastName) AS patientName,
        CONCAT(d.firstName, ' ', d.lastName) AS doctorName
      FROM appointment a
      LEFT JOIN patient p ON a.patientId = p.id
      LEFT JOIN doctor d ON a.doctorId = d.id
      WHERE 1=1
    `;

    const params = [];

    if (patientId) {
      query += ' AND a.patientId = ?';
      params.push(patientId);
    }
    if (doctorId) {
      query += ' AND a.doctorId = ?';
      params.push(doctorId);
    }
    if (status) {
      query += ' AND a.appointmentStatus = ?';
      params.push(status);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};



// Get appointment by IDs
exports. getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM appointment WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

// Update appointment (reschedule, check-in, cancel, notes)
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointmentDate, appointmentStatus, notes } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE appointment SET 
        appointmentDate = COALESCE(?, appointmentDate),
        appointmentStatus = COALESCE(?, appointmentStatus),
        notes = COALESCE(?, notes),
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [appointmentDate, appointmentStatus, notes, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// Delete (cancel) appointment
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM appointment WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,firstname FROM patient');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname FROM doctor');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

