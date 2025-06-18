const db = require('../../config');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// staffController.js


exports.getAllStaff = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM staff ORDER BY id DESC"); // جلب كل البيانات من جدول staff
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Failed to fetch staff data" });
  }
};

exports.getCounts = async (req, res) => {
  try {
    const [[doctors]] = await db.query('SELECT COUNT(*) AS count FROM Doctor');
    const [[patients]] = await db.query('SELECT COUNT(*) AS count FROM Patient');
    const [[appointments]] = await db.query('SELECT COUNT(*) AS count FROM Appointment');

    res.json({
      doctors: doctors.count,
      patients: patients.count,
      appointments: appointments.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRecentAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.firstName AS patientName,
        p.image AS patientImage,  -- This is just the filename like "john.jpg"
        d.firstName AS doctorName,
        a.id,
        a.appointmentDate,
        a.appointmentStatus
      FROM Appointment a
      JOIN Patient p ON a.patientId = p.id
      JOIN Doctor d ON a.doctorId = d.id
      ORDER BY a.appointmentDate DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// controllers/appointmentController.js
exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id,
        p.firstName AS patientName,
        d.firstName AS doctorName,
        a.appointmentDate,
        TIME_FORMAT(a.appointmentDate, '%H:%i') AS appointmentTime,
        a.appointmentStatus
      FROM Appointment a
      JOIN Patient p ON a.patientId = p.id
      JOIN Doctor d ON a.doctorId = d.id
      ORDER BY a.appointmentDate DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["Scheduled", "Completed", "Cancelled"];
if (!validStatuses.includes(status)) {
  return res.status(400).json({ error: "Invalid status value" });
}

    await db.query(
      `UPDATE Appointment SET appointmentStatus = ? WHERE id = ?`,
      [status, id]
    );
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};
exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get appointment info (including patientId and doctor name)
    const [result] = await db.query(`
      SELECT a.patientId, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
      FROM appointment a
      JOIN doctor d ON a.doctorId = d.id
      WHERE a.id = ?
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { patientId, doctorFirstName, doctorLastName } = result[0];

    // 2. Update appointment status to "Cancelled"
    await db.query('UPDATE appointment SET appointmentStatus = ? WHERE id = ?', ['Cancelled', id]);

    // 3. Send notification to patient
    const message = `Your appointment with Dr. ${doctorFirstName} ${doctorLastName} has been cancelled.`;
    await db.query('INSERT INTO notifications (patientId, message) VALUES (?, ?)', [patientId, message]);

    res.json({ message: 'Appointment cancelled and notification sent' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error cancelling appointment' });
  }
};

// src/controllers/doctorController.js


// controllers/doctorController.js

// GET all doctors
exports.getDoctors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctor');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// GET single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctor WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// POST create doctor


// Adjust the path if needed

// exports.createDoctor = async (req, res) => {
//   const {
//     username,
//     email,
//     firstName,
//     lastName,
//     specialty,
//     phoneNumber,
//     address,
//     degree,
//     fees,
//     experience,
//     about,
//     image,
//     availability // array of { dayOfWeek, startTime, endTime }
//   } = req.body;

//   const conn = await db.getConnection();
//   await conn.beginTransaction();

//   try {
//     // Check if doctor with same username or email already exists
//     const [existing] = await conn.query(
//       "SELECT id FROM doctor WHERE username = ? OR email = ?",
//       [username, email]
//     );
//     if (existing.length > 0) {
//       await conn.rollback();
//       return res.status(400).json({ message: "Username or email already exists" });
//     }

//     // Generate a random password
//     const generatedPassword = crypto.randomBytes(6).toString("hex"); // 12-char password
//     const hashedPassword = await bcrypt.hash(generatedPassword, 10);

//     // Insert into doctor table
//     const [result] = await conn.query(
//       `INSERT INTO doctor (
//         firstName, lastName, specialty, phoneNumber, email,
//         address, degree, fees, experience, about,
//         image, username, passwordHash, createdAt, updatedAt
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       [
//         firstName, lastName, specialty, phoneNumber, email,
//         address, degree, fees, experience, about,
//         image, username, hashedPassword
//       ]
//     );

//     const doctorId = result.insertId;

//     // Insert availability if provided
//     if (availability && availability.length > 0) {
//       const availabilityValues = availability.map(({ dayOfWeek, startTime, endTime }) => [
//         doctorId, dayOfWeek, startTime, endTime
//       ]);
//       const placeholders = availabilityValues.map(() => "(?, ?, ?, ?)").join(", ");
//       const flattenedValues = availabilityValues.flat();
//       await conn.query(
//         `INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime) VALUES ${placeholders}`,
//         flattenedValues
//       );
//     }

//     // Email the doctor with their credentials
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your Account Credentials",
//       text: `Welcome Dr. ${firstName},\n\nYour account has been created.\n\nUsername: ${username}\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease log in and change your password immediately after your first login.\n\nBest regards,\nYour Clinic Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     await conn.commit();
//     res.status(201).json({ message: "Doctor created and credentials sent via email", doctorId });

//   } catch (err) {
//     await conn.rollback();
//     console.error("Error creating doctor:", err);
//     res.status(500).json({ message: "Error creating doctor", error: err.message });
//   } finally {
//     conn.release();
//   }
// };


// PUT update doctor
exports.updateDoctor = async (req, res) => {
  const {
    firstName, lastName, specialty, phoneNumber, email,
    address, degree, fees, experience, about, image,
  } = req.body;

  try {
    await db.query(
      `UPDATE doctor SET 
      firstName=?, lastName=?, specialty=?, phoneNumber=?, email=?, address=?, degree=?, fees=?, experience=?, about=?, image=?, updatedAt=NOW()
      WHERE id=?`,
      [firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image, req.params.id]
    );

    const [updatedDoctor] = await db.query('SELECT * FROM doctor WHERE id = ?', [req.params.id]);
    res.json(updatedDoctor[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update doctor' });
  }
};

// DELETE doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await db.query('DELETE FROM doctor WHERE id = ?', [req.params.id]);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};
// Get count of doctors
exports.getDoctorsCount = async (req, res) => {
  try {
    const [[result]] = await db.query('SELECT COUNT(*) AS count FROM doctor');
    res.json({ count: result.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors count' });
  }
};

//new functions used 
exports.addDoctor = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const {
      userId,
      firstName,
      lastName,
      specialty,
      phoneNumber,
      email,
      password,
      address,
      degree,
      professional_registration_number,
      fees,
      about,
      image,
      hiringDate,
      availability,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorSql = `
      INSERT INTO doctor 
      (userId, firstName, lastName, specialty, phoneNumber, email, password, address, degree, professional_registration_number, fees, about, image, hiringDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [doctorResult] = await connection.query(doctorSql, [
      userId,
      firstName,
      lastName,
      specialty,
      phoneNumber,
      email,
      hashedPassword,
      address,
      degree,
      professional_registration_number,
      fees,
      about,
      image,
      hiringDate,
    ]);

    const doctorId = doctorResult.insertId;

    const availabilitySql = `
      INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime)
      VALUES (?, ?, ?, ?)
    `;

    const today = new Date().toISOString().split('T')[0];

    for (const slot of availability) {
      const { dayOfWeek, startTime, endTime } = slot;

      const formattedStartTime = `${today} ${startTime}:00`;
      const formattedEndTime = `${today} ${endTime}:00`;

      await connection.query(availabilitySql, [
        doctorId,
        dayOfWeek,
        formattedStartTime,
        formattedEndTime,
      ]);
    }

    await connection.commit();
    res.status(201).json({ message: "Doctor and availability added successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error adding doctor and availability:", error);
    res.status(500).json({ error: "Failed to add doctor and availability" });
  } finally {
    connection.release();
  }
};
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [adminRows] = await db.query(
      "SELECT * FROM admin WHERE username = ?",
      [email]
    );

    if (adminRows.length === 0) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const admin = adminRows[0];

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: admin.id, role: "Admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Admin login successful!",
      token,
      role: "Admin",
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error during admin login." });
  }
};

async function createAdmin(username, plainPassword) {
  try {
    // Hash the plain password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert admin into the database with hashed password
    const [result] = await db.query(
      "INSERT INTO admin (username, passwordHash) VALUES (?, ?)",
      [username, hashedPassword]
    );

    console.log("Admin created with ID:", result.insertId);
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}

// Usage
// createAdmin("admin@example.comr", "admin123"); 



