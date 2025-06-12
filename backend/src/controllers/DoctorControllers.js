// const db = require('../../config');
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
const db = require('../../config'); // Your MySQL db connection
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
      LIMIT 5`
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
    about
  } = req.body;

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  try {
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
        image = COALESCE(?, image)
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
      id
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
    availability // array of { dayOfWeek, startTime, endTime }
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

    // Generate a random password
    const generatedPassword = crypto.randomBytes(6).toString("hex"); // 12-char password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

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

    // Insert availability if provided
    if (availability && availability.length > 0) {
      const availabilityValues = availability.map(({ dayOfWeek, startTime, endTime }) => [
        doctorId, dayOfWeek, startTime, endTime
      ]);
      const placeholders = availabilityValues.map(() => "(?, ?, ?, ?)").join(", ");
      const flattenedValues = availabilityValues.flat();
      await conn.query(
        `INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime) VALUES ${placeholders}`,
        flattenedValues
      );
    }

    // Email the doctor with their credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Aeternum " <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Credentials",
      text: `Welcome Dr. ${firstName},\n\nYour account has been created.\n\nUsername: ${username}\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease log in and change your password immediately after your first login.\n\nBest regards,\nAmoula lhaboula`,
    };

    await transporter.sendMail(mailOptions);

    await conn.commit();
    res.status(201).json({ message: "Doctor created and credentials sent via email", doctorId });

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
    // 1. Get appointment info (including patientId, patient email, and doctor name)
    const [result] = await db.query(`
      SELECT a.patientId, a.appointmentDate, p.email AS patientEmail,
             d.firstName AS doctorFirstName, d.lastName AS doctorLastName
      FROM appointment a
      JOIN doctor d ON a.doctorId = d.id
      JOIN patient p ON a.patientId = p.id
      WHERE a.id = ?
    `, [appointmentId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { patientId, patientEmail, doctorFirstName, doctorLastName, appointmentDate } = result[0];

    // 2. Update appointment status to "Cancelled"
    await db.query('UPDATE appointment SET appointmentStatus = ? WHERE id = ?', ['Cancelled', appointmentId]);

    // 3. Send notification to patient in database
    const message = `Your appointment with Dr. ${doctorFirstName} ${doctorLastName} on ${appointmentDate} has been cancelled.`;
    await db.query('INSERT INTO notifications (patientId, message) VALUES (?, ?)', [patientId, message]);

    // 4. Send email notification to patient
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Aeternum" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: "Appointment Cancelled",
      text: `Dear Patient,\n\n${message}\n\nPlease contact us if you want to reschedule.\n\nBest regards,\nYour Clinic Team`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Appointment cancelled, notification sent, and email delivered' });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error cancelling appointment' });
  }
};

exports.getPatientById = async (req, res) => {
  const patientId = parseInt(req.params.patientId, 10);

  if (isNaN(patientId) || patientId <= 0) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    const [rows] = await db.query('SELECT * FROM patient WHERE id = ?', [patientId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addMedicalRecord = async (req, res) => {
  const {
    patientId,
    doctorId,
    diagnosis,
    treatment,
    prescription,
    recordDate,
  } = req.body;

  // Basic validation
  if (
    !patientId ||
    isNaN(parseInt(patientId, 10)) ||
    !doctorId ||
    isNaN(parseInt(doctorId, 10)) ||
    !diagnosis ||
    !treatment ||
    !recordDate
  ) {
    return res.status(400).json({ error: "Missing or invalid required fields." });
  }

  try {
    const sql = `
      INSERT INTO medicalrecord (patientId, doctorId, diagnosis, treatment, prescription, recordDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      patientId,
      doctorId,
      diagnosis,
      treatment,
      prescription || null,
      recordDate,
    ]);

    return res.status(201).json({
      message: "Medical record added successfully.",
      recordId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding medical record:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

