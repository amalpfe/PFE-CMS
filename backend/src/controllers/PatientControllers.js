
const axios = require('axios'); 
const { validationResult } = require('express-validator');// controllers/signupController.js
const bcrypt = require('bcryptjs');
const db = require('../../config');
const saltRounds = 10;

const pool = require('../../config'); // Assuming your MySQL pool is configured in config.js
const jwt = require('jsonwebtoken');
// Handle user signup
const handleSignup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM patient WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      "INSERT INTO patient (username, email, passwordHash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//Handle user login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM patient WHERE email = ?", [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Optional: Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Send user info + token (you can customize fields sent to frontend)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
  
};

//Handle doctors page
const getAllDoctors = async (req, res) => {
  const query = `
    SELECT 
      id, 
      CONCAT(firstName, ' ', lastName) AS name, 
      specialty AS speciality, 
      image 
    FROM doctor
  `;

  try {
    const [results] = await pool.query(query);

    const updatedResults = results.map((doc) => ({
      ...doc,
      image: doc.image.startsWith("data:")
        ? doc.image
        : `data:image/png;base64,${doc.image}`,
    }));

    res.status(200).json(updatedResults);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors", error: err });
  }
};


const getDoctorDetails = async (req, res) => {
 const doctorId = req.params.id;

  try {
    // 1. Get doctor details
    const [doctorRows] = await pool.execute("SELECT * FROM doctor WHERE id = ?", [
      doctorId,
    ]);
    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctor = doctorRows[0];

    // 2. Get doctor availability
    const [availabilityRows] = await pool.execute(
      "SELECT * FROM doctoravailability WHERE doctorId = ?",
      [doctorId]
    );

    res.status(200).json({
      ...doctor,
      availability: availabilityRows,
    });
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleApp = async (req, res) => {
  const { patientId, doctorId, appointmentDate } = req.body;

  if (!patientId || !doctorId || !appointmentDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Check if an appointment already exists at that datetime for this doctor
    const [existingAppointments] = await pool.execute(
      `SELECT * FROM appointment 
       WHERE doctorId = ? AND appointmentDate = ?`,
      [doctorId, appointmentDate]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        error: "This appointment slot is already booked. Please choose another time.",
      });
    }

    // Step 2: Insert the new appointment
    const [result] = await pool.execute(
      `INSERT INTO appointment 
       (patientId, doctorId, appointmentDate, appointmentStatus, createdAt, updatedAt) 
       VALUES (?, ?, ?, 'Scheduled', NOW(), NOW())`,
      [patientId, doctorId, appointmentDate]
    );

    res.status(201).json({
      message: "Appointment booked successfully",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const addReview = async (req, res) => {
  const { appointmentId, patientId, rating, comment } = req.body;

  console.log("Review request body:", req.body);

  if (!appointmentId || !patientId || !rating || !comment) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [appointments] = await pool.execute(
      "SELECT * FROM appointment WHERE id = ? AND patientId = ?",
      [appointmentId, patientId]
    );

    console.log("Appointment query result:", appointments);

    if (appointments.length === 0) {
      return res.status(404).json({ 
        message: `Appointment with id ${appointmentId} for patient ${patientId} not found.` 
      });
    }

    await pool.execute(
      `INSERT INTO feedback (appointmentId, patientId, rating, comment, submittedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [appointmentId, patientId, rating, comment]
    );

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const [appointments] = await pool.execute(
      `
      SELECT 
        a.id AS appointmentId,
        a.appointmentDate,
        a.appointmentStatus,
        a.notes,
        d.id AS doctorId,
        CONCAT(firstName, ' ', lastName) AS doctorName,
        d.specialty,
        d.image AS doctorImage,
        d.address
      FROM appointment a
      JOIN doctor d ON a.doctorId = d.id
      WHERE a.patientId = ?
      ORDER BY a.appointmentDate DESC
      `,
      [patientId]
    );

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      'SELECT id, firstName, lastName, email, phoneNumber, gender, dateOfBirth, address FROM patient WHERE id = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patient = result[0];
    const name = `${patient.firstName} ${patient.lastName}`;
    const [line1, line2 = ''] = (patient.address || "").split(',');

    res.json({
      name,
      email: patient.email,
      phone: patient.phoneNumber,
      gender: patient.gender,
      dob: patient.dateOfBirth,
      image: patient.image,
      address: { line1: line1.trim(), line2: line2.trim() },
    });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getMedicalRecordsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required." });
  }

  try {
    const [records] = await pool.execute(
      `SELECT id, recordDate AS visitDate, diagnosis, treatment, prescription 
       FROM medicalrecord 
       WHERE patientId = ? 
       ORDER BY recordDate DESC`,
      [patientId]
    );

    res.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ error: "Failed to fetch medical records." });
  }
};

const getLabResults = (req, res) => {
  const patientId = req.params.patientId;

  const query = `
    SELECT * FROM labtestresult
    WHERE patientId = ?
    ORDER BY testDate DESC
  `;

  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error("Error fetching lab results:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await pool.execute(
      "INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    res.status(200).json({ message: "Message received successfully!" });
  } catch (err) {
    console.error("Error saving contact form:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
const UpdateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender, dob, address } = req.body;

  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ') || '';
  const fullAddress = `${address.line1}, ${address.line2}`;

  try {
    const [result] = await pool.query(
      `UPDATE patient 
       SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, gender = ?, dateOfBirth = ?, address = ? 
       WHERE id = ?`,
      [firstName, lastName, email, phone, gender, dob, fullAddress, id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const submitFeedback = async (req, res) => {
  try {
    const { appointmentId, patientId, rating, comment } = req.body;

    if (!appointmentId || !patientId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `
      INSERT INTO feedback (appointmentId, patientId, rating, comment, submittedAt)
      VALUES (?, ?, ?, ?, NOW())
    `;

    await pool.execute(query, [appointmentId, patientId, rating, comment]);

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// 1. GET all patients
const getAllPatients = async (req, res) => {
  try {
    const [patients] = await pool.execute("SELECT * FROM patient");
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ message: "Server error while fetching patients" });
  }
};

// 2. DELETE a patient by ID
const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM patient WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error.message);
    res.status(500).json({ message: "Server error while deleting patient" });
  }
};

// 3. UPDATE a patient by ID
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    address,
    emergencyContactName,
    emergencyContactPhone,
  } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE patient SET 
        firstName = ?, 
        lastName = ?, 
        dateOfBirth = ?, 
        gender = ?, 
        phoneNumber = ?, 
        email = ?, 
        address = ?, 
        emergencyContactName = ?, 
        emergencyContactPhone = ?,
        updatedAt = NOW()
      WHERE id = ?`,
      [
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phoneNumber,
        email,
        address,
        emergencyContactName,
        emergencyContactPhone,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const [updatedPatientRows] = await pool.execute("SELECT * FROM patient WHERE id = ?", [id]);

    res.status(200).json(updatedPatientRows[0]);
  } catch (error) {
    console.error("Error updating patient:", error.message);
    res.status(500).json({ message: "Server error while updating patient" });
  }
};
const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Appointment ID is required." });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE appointment 
       SET appointmentStatus = 'Cancelled', updatedAt = NOW() 
       WHERE id = ?`,
      [appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    res.status(200).json({ success: true, message: "Appointment cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Failed to cancel appointment." });
  }
};
 const notifApp = async (req, res) => {
  const { patientId } = req.params;

  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE patientId = ? ORDER BY createdAt DESC',
      [patientId]
    );
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
  getAllDoctors,
  getDoctorDetails,
  handleApp,
  addReview,
  getAppointmentsByPatient,
  getProfile,
  getMedicalRecordsByPatientId,
  getLabResults,
  contactUs,
  UpdateProfile,
  submitFeedback,
  getAllPatients,
  deletePatient,
  updatePatient,
  cancelAppointment,
  notifApp
};
