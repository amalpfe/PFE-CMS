
const axios = require('axios'); 
const { validationResult } = require('express-validator');// controllers/signupController.js
const bcrypt = require('bcryptjs');
const db = require('../../config');
const saltRounds = 10;

const pool = require('../../config'); // Assuming your MySQL pool is configured in config.js
const jwt = require('jsonwebtoken');
// Handle user signup
const handleSignup = async (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if email already exists
    const [existingEmail] = await pool.query("SELECT id FROM patient WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const [existingUsername] = await pool.query("SELECT id FROM patient WHERE username = ?", [username]);
    if (existingUsername.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      "INSERT INTO patient (firstName, lastName, email, username, passwordHash) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, username, hashedPassword]
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
    WHERE isActive = 1
  `;

  try {
    const [results] = await pool.query(query);

    const updatedResults = results.map((doc) => ({
      ...doc,
      image:
        typeof doc.image === "string" && doc.image.startsWith("data:")
          ? doc.image
          : doc.image
          ? `data:image/png;base64,${doc.image}`
          : null, // fallback if needed
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

  try {
    // Step 1: Check if slot already exists
    const [existing] = await db.execute(
      "SELECT * FROM appointment WHERE doctorId = ? AND appointmentDate = ?",
      [doctorId, appointmentDate]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // Step 2: Insert appointment
    const [appointmentResult] = await db.execute(
      `INSERT INTO appointment (patientId, doctorId, appointmentDate, appointmentStatus)
       VALUES (?, ?, ?, 'Scheduled')`,
      [patientId, doctorId, appointmentDate]
    );

    const appointmentId = appointmentResult.insertId;

    // Step 3: Get doctor's fee to calculate billing amount
    const [doctorData] = await db.execute(
      "SELECT fees FROM doctor WHERE id = ?",
      [doctorId]
    );

    const amount = doctorData[0]?.fees ?? 0;

    // Step 4: Insert into billing
    await db.execute(
      `INSERT INTO billing (patientId, appointmentId, amount, paymentStatus, paymentMethod, createdAt)
       VALUES (?, ?, ?, 'Pending', 'Card', NOW())`,
      [patientId, appointmentId, amount]
    );

    return res.status(201).json({ message: "Appointment and billing created successfully." });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const addReview = async (req, res) => {
  try {
    const { appointmentId, patientId, rating, comment } = req.body;

    // Validate required fields
    if (!appointmentId || !patientId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1. Check appointment date
    const [appointments] = await pool.execute(
      "SELECT appointmentDate FROM appointment WHERE id = ? AND patientId = ?",
      [appointmentId, patientId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const appointmentDate = new Date(appointments[0].appointmentDate);
    const currentDate = new Date();
    if (appointmentDate > currentDate) {
      return res.status(400).json({ message: "You can only review past appointments." });
    }

    // 2. Check if review already exists
    const [existingReview] = await pool.execute(
      "SELECT * FROM feedback WHERE appointmentId = ? AND patientId = ?",
      [appointmentId, patientId]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ message: "You already submitted a review for this appointment." });
    }

    // 3. Insert new review
    await pool.execute(
      "INSERT INTO feedback (appointmentId, patientId, rating, comment, submittedAt) VALUES (?, ?, ?, ?, NOW())",
      [appointmentId, patientId, rating, comment]
    );

    return res.status(201).json({ message: "Review submitted successfully." });

  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
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
// ✅ UpdateProfile Function
const UpdateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      addressLine1,
      addressLine2,
      weight,
      height,
      geneticDiseases,
      chronicDiseases,
      allergies,
      bloodGroup,
      maritalStatus,
      hasSurgery,
      image, // optional base64 string
    } = req.body;

    const patientId = req.params.id;

    const updateFields = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      address: JSON.stringify({
        line1: addressLine1 || "",
        line2: addressLine2 || "",
      }),
      weight: weight || null,
      height: height || null,
      geneticDiseases: geneticDiseases || "",
      chronicDiseases: chronicDiseases || "",
      allergies: allergies || "",
      bloodGroup: bloodGroup || "",
      maritalStatus: maritalStatus || "",
      hasSurgery: hasSurgery ?? null,
    };

    if (image) {
      updateFields.image = image;
    }

    await pool.query('UPDATE patient SET ? WHERE id = ?', [
      updateFields,
      patientId,
    ]);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `SELECT 
        id, firstName, lastName, email, phoneNumber, gender, 
        dateOfBirth, address, image,
        weight, height, geneticDiseases, chronicDiseases,
        allergies, bloodGroup, maritalStatus, hasSurgery
      FROM patient WHERE id = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patient = result[0];
    let line1 = "", line2 = "";

    try {
      const parsedAddress = JSON.parse(patient.address || "{}");
      line1 = parsedAddress.line1 || "";
      line2 = parsedAddress.line2 || "";
    } catch {
      line1 = "";
      line2 = "";
    }

    res.json({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      image: patient.image,
      address: {
        line1,
        line2,
      },
      weight: patient.weight,
      height: patient.height,
      geneticDiseases: patient.geneticDiseases,
      chronicDiseases: patient.chronicDiseases,
      allergies: patient.allergies,
      bloodGroup: patient.bloodGroup,
      maritalStatus: patient.maritalStatus,
      hasSurgery: patient.hasSurgery,
    });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};






const getMedicalRecordsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  if (!patientId || isNaN(parseInt(patientId, 10))) {
    return res.status(400).json({ error: "Valid patient ID is required." });
  }

  try {
    const [records] = await pool.execute(
      `SELECT 
         id, 
         recordDate AS visitDate, 
         diagnosis, 
         treatment, 
         prescription, 
         notes, 
         attachment 
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
// GET /patient/appointments/:doctorId
const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [appointments] = await db.query(
      `SELECT appointmentDate FROM appointment
       WHERE doctorId = ? AND appointmentStatus = 'Scheduled'`,
      [doctorId]
    );
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
const getPatientById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM patient WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Patient not found" });

    const user = rows[0];
    
    // تأكد أن الصورة تبدأ بـ data:image إذا مش موجودة
    if (user.image && !user.image.startsWith("data:image")) {
      user.image = `data:image/jpeg;base64,${user.image}`;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleSignup,
  getPatientById,
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
  notifApp,
  getDoctorAppointments
};
