// const db = require('../../config');
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
const db = require('../../config'); // Your MySQL db connection

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

// controllers/doctorController.js

exports.getPatientsByDoctorAppointments = async (req, res) => {
  const doctorId = parseInt(req.params.doctorId, 10);

  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const [rows] = await db.query(`
      SELECT DISTINCT p.*
      FROM appointment a
      JOIN patient p ON a.patientId = p.id
      WHERE a.doctorId = ?
    `, [doctorId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching patients by doctor:", error);
    res.status(500).json({ error: "Internal server error" });
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

// const jwt = require('jsonwebtoken');
// const saltRounds = 10;

exports.createDoctor = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    specialty,
    phoneNumber,
    address,
    degree,
    fees,
    experience,
    about,
    image,
    availability // Expecting an array of { dayOfWeek, startTime, endTime }
  } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // Check if doctor with same username or email already exists
    const [existing] = await conn.query(
      "SELECT id FROM doctor WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into doctor table
    const [result] = await conn.query(
      `INSERT INTO doctor (
        firstName, lastName, specialty, phoneNumber, email,
        address, degree, fees, experience, about,
        image, username, passwordHash, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        firstName, lastName, specialty, phoneNumber, email,
        address, degree, fees, experience, about,
        image, username, hashedPassword
      ]
    );

    const doctorId = result.insertId;

    if (availability && availability.length > 0) {
      const availabilityValues = availability.map(({ dayOfWeek, startTime, endTime }) => [
        doctorId,
        dayOfWeek,
        startTime,
        endTime,
      ]);

      // Prepare placeholders for bulk insert
      const placeholders = availabilityValues.map(() => "(?, ?, ?, ?)").join(", ");

      // Flatten the array of values
      const flattenedValues = availabilityValues.flat();

      await conn.query(
        `INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime) VALUES ${placeholders}`,
        flattenedValues
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Doctor created successfully", doctorId });
  } catch (err) {
    await conn.rollback();
    console.error("Error creating doctor:", err);
    res.status(500).json({ message: "Error creating doctor", error: err.message });
  } finally {
    conn.release();
  }
};



exports.getProfile = async (req, res) => {
   try {
    const doctorId = req.params.id;
const [doctor] = await db.query("SELECT * FROM doctor WHERE id = ?", [doctorId]);


    if (doctor.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor[0]);
  } catch (err) {
    console.error("Error fetching doctor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginDoctor= async (req, res) => {
  const { email, password } = req.body;

  try {
    const [doctorRows] = await db.query(
      "SELECT * FROM doctor WHERE email = ?",
      [email]
    );

    if (doctorRows.length === 0) {
      return res.status(401).json({ message: "Invalid doctor credentials." });
    }

    const doctor = doctorRows[0];

    const match = await bcrypt.compare(password, doctor.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: doctor.id, role: "Doctor" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Doctor login successful!",
      token,
      role: "Doctor",
      doctor: {
        id: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        specialty: doctor.specialty,
        email: doctor.email,
      },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    return res.status(500).json({ message: "Server error during doctor login." });
  }
};
exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    // 1. Get appointment info (including patientId and doctor name)
    const [result] = await db.query(`
      SELECT a.patientId, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
      FROM appointment a
      JOIN doctor d ON a.doctorId = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { patientId, doctorFirstName, doctorLastName } = result[0];

    // 2. Update appointment status to "Cancelled"
    await db.query('UPDATE appointment SET appointmentStatus = ? WHERE id = ?', ['Cancelled', appointmentId]);

    // 3. Send notification to patient
    const message = `Your appointment with Dr. ${doctorFirstName} ${doctorLastName} has been cancelled.`;
    await db.query('INSERT INTO notifications (patientId, message) VALUES (?, ?)', [patientId, message]);

    res.json({ message: 'Appointment cancelled and notification sent' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error cancelling appointment' });
  }
};
