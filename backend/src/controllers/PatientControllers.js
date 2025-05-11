
const axios = require('axios'); 
const { validationResult } = require('express-validator');// controllers/signupController.js
const bcrypt = require('bcryptjs');
const pool = require('../../config'); // Assuming your MySQL pool is configured in config.js
const jwt = require('jsonwebtoken');
// Handle user signup
const handleSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Simple validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill out all required fields." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if email already exists
    const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.execute(
      'INSERT INTO user (username, passwordHash, email, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, hashedPassword, email, 'Patient', 'Active']
    );

    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

//Handle user login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // تحقق من وجود المستخدم
    const [user] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const foundUser = user[0];

    // تحقق من كلمة السر
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // إنشاء توكن
    const token = jwt.sign(
      { id: foundUser.id, role: foundUser.role },
      "SECRET_KEY", // بدّك تغيّرها ببيئة الإنتاج
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Handle doctors page
const getAllDoctors = async (req, res) => {
  const query = `SELECT id, CONCAT(firstName, ' ', lastName) AS name, specialty AS speciality, image AS Image FROM doctor`;

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors", error: err });
  }
};

const getDoctorDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch doctor details
    const [doctorResult] = await pool.query(
      `SELECT id, CONCAT(firstName, ' ', lastName) AS name, 
              specialty AS speciality, phoneNumber, email, address, 
              degree, fees, experience, about, image AS Image
       FROM doctor
       WHERE id = ?`,
      [id]
    );

    if (doctorResult.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctor = doctorResult[0];

    // Fetch doctor availability
    const [availabilityResult] = await pool.query(
      `SELECT dayOfWeek, startTime, endTime
       FROM doctoravailability
       WHERE doctorId = ?`,
      [id]
    );

    doctor.availability = availabilityResult;

    return res.status(200).json(doctor);
  } catch (err) {
    console.error("Error fetching doctor details:", err);
    return res.status(500).json({
      message: "Failed to fetch doctor details",
      error: err.message,
    });
  }
};
const handleApp = async (req, res) => {

const { patientId, doctorId, appointmentDate } = req.body;

  if (!patientId || !doctorId || !appointmentDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO appointment 
       (patientId, doctorId, appointmentDate, appointmentStatus, createdAt, updatedAt) 
       VALUES (?, ?, ?, 'Scheduled', NOW(), NOW())`,
      [patientId, doctorId, appointmentDate || null]
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

  if (!appointmentId || !patientId || !rating || !comment) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // تحقق أولاً أن الـ appointment موجود ومرتبط بنفس المريض
    const [appointments] = await pool.execute(
      "SELECT * FROM appointment WHERE id = ? AND patientId = ?",
      [appointmentId, patientId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: "Appointment not found or mismatch" });
    }

    // إدخال التقييم
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
  const { userId } = req.params;

  try {
    const [patient] = await pool.execute(
      `SELECT 
        p.id, 
        p.firstName, 
        p.lastName, 
        p.dateOfBirth, 
        p.gender, 
        p.phoneNumber, 
        p.email, 
        p.address, 
        p.emergencyContactName, 
        p.emergencyContactPhone, 
        p.createdAt, 
        p.updatedAt
      FROM patient p
      WHERE p.userId = ?`,
      [userId]
    );

    if (patient.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, data: patient[0] });
  } catch (error) {
    console.error("Error fetching patient profile:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
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
  getProfile
};
