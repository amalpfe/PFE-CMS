const db = require('../../config');

exports.getDoctorDashboard = async (req, res) => {
  const doctorId = req.params.id;

  const queries = {
    earnings: `
      SELECT SUM(b.amount) AS totalEarnings 
      FROM Billing b 
      JOIN Appointment a ON b.appointmentId = a.id 
      WHERE a.doctorId = ? AND b.paymentStatus = 'Paid'`,

    appointments: `
      SELECT COUNT(*) AS totalAppointments 
      FROM Appointment 
      WHERE doctorId = ?`,

    patients: `
      SELECT COUNT(DISTINCT patientId) AS totalPatients 
      FROM Appointment 
      WHERE doctorId = ?`,

    bookings: `
      SELECT p.firstName, p.lastName, a.appointmentDate, a.appointmentStatus 
      FROM Appointment a 
      JOIN Patient p ON a.patientId = p.id 
      WHERE a.doctorId = ? 
      ORDER BY a.appointmentDate DESC 
      LIMIT 4`
  };

  try {
    const [[earningsResult]] = await db.query(queries.earnings, [doctorId]);
    const [[apptResult]] = await db.query(queries.appointments, [doctorId]);
    const [[patientResult]] = await db.query(queries.patients, [doctorId]);
    const [bookingResult] = await db.query(queries.bookings, [doctorId]);

    const results = {
      earnings: earningsResult.totalEarnings || 0,
      appointments: apptResult.totalAppointments,
      patients: patientResult.totalPatients,
      bookings: bookingResult.map(b => ({
        name: `${b.firstName} ${b.lastName}`,
        date: new Date(b.appointmentDate).toLocaleDateString(),
        status: b.appointmentStatus
      }))
    };

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error", details: err });
  }
};


// Get all appointments for a doctor by doctorId (from URL param)

exports.getDoctorAppointments = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [appointments] = await db.query(
      `SELECT 
         a.id, 
         a.appointmentDate, 
         a.appointmentStatus, 
         p.firstName, 
         p.lastName 
       FROM Appointment a 
       JOIN Patient p ON a.patientId = p.id 
       WHERE a.doctorId = ? 
       ORDER BY a.appointmentDate DESC 
       LIMIT 5`,
      [doctorId]
    );

    const formatted = appointments.map(appt => ({
      name: `${appt.firstName} ${appt.lastName}`,
      date: new Date(appt.appointmentDate).toLocaleDateString(),
      status: appt.appointmentStatus
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};



exports. getAppointmentsByDoctor = async (req, res) => {
  const doctorId = req.params.id;

const query = `
  SELECT 
    a.id AS appointmentId,
    CONCAT(p.firstName, ' ', p.lastName) AS patient,
    TIMESTAMPDIFF(YEAR, p.dateOfBirth, CURDATE()) AS age,
    a.appointmentDate,
    d.fees,
    a.appointmentStatus AS status,
    a.notes
  FROM appointment a    -- <--- change here from appointments to appointment
  JOIN patient p ON a.patientId = p.id
  JOIN doctor d ON a.doctorId = d.id
  WHERE a.doctorId = ?
  ORDER BY a.appointmentDate DESC
`;


  try {
    const [rows] = await db.execute(query, [doctorId]);

    const formatted = rows.map((row) => ({
      id: row.appointmentId,
      patient: row.patient,
      age: row.age,
      datetime: new Date(row.appointmentDate).toLocaleString(),
      fees: `$${row.fees}`,
      status: row.status,
      notes: row.notes || "",
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// GET /doctor/:id/profile
// exports.getProfile = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const sql = `
//       SELECT id, userId, firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image, createdAt, updatedAt
//       FROM doctor
//       WHERE id = ?
//     `;

//     const [rows] = await db.query(sql, [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// PUT /doctor/:id/profile
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res) => {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    specialty,
    phoneNumber,
    email,
    address,
    degree,
    fees,
    experience,
    about,
    image, // base64 string
  } = req.body;

  try {
    let imagePath = null;

    if (image && image.startsWith('data:image')) {
      // Example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...

      // Extract base64 data
      const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: 'Invalid image format' });
      }

      const ext = matches[1]; // e.g. png, jpeg
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Create uploads folder if not exists
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      // Define filename (you can customize name)
      const filename = `doctor-${id}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      // Save file
      fs.writeFileSync(filepath, buffer);

      // Set path to store in DB (relative or URL)
      imagePath = `/uploads/${filename}`;
    }

    // SQL to update doctor profile
    const sql = `
      UPDATE doctor SET
        firstName = ?,
        lastName = ?,
        specialty = ?,
        phoneNumber = ?,
        email = ?,
        address = ?,
        degree = ?,
        fees = ?,
        experience = ?,
        about = ?,
        image = COALESCE(?, image)  -- only update if new image is uploaded
      WHERE id = ?
    `;

    const values = [
      firstName,
      lastName,
      specialty,
      phoneNumber,
      email,
      address,
      degree,
      fees,
      experience,
      about,
      imagePath,
      id,
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/////////////new/////////////
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const db = require('../config/db'); // adjust the path as needed

exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check user
    const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 2. Check role
    if (user.role !== 'Doctor') {
      return res.status(403).json({ error: 'User is not a doctor' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Get doctor profile
    const [doctors] = await db.query('SELECT * FROM doctor WHERE userId = ?', [user.id]);
    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const doctor = doctors[0];

    // 5. Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        doctorId: doctor.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'yourDefaultSecret',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  const doctorId = req.user.doctorId;

  try {
    const [rows] = await db.query('SELECT * FROM doctor WHERE id = ?', [doctorId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
