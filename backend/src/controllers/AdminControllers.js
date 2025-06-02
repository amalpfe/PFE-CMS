const db = require('../../config');

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
        d.firstName AS doctorName,
        a.appointmentDate,
        a.appointmentStatus
      FROM Appointment a
      JOIN Patient p ON a.patientId = p.id
      JOIN Doctor d ON a.doctorId = d.id
      ORDER BY a.appointmentDate DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
// src/controllers/doctorController.js


exports.addDoctor = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
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
      image,
      availability, // Array of { dayOfWeek, startTime, endTime }
    } = req.body;

    // 1. Insert into doctor table
    const doctorSql = `
      INSERT INTO doctor
      (firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [doctorResult] = await connection.query(doctorSql, [
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
      image,
    ]);

    const doctorId = doctorResult.insertId;

    // 2. Insert into doctoravailability
    const availabilitySql = `
      INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime)
      VALUES (?, ?, ?, ?)
    `;

    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-05-28"

    for (const slot of availability) {
      const { dayOfWeek, startTime, endTime } = slot;

      // Ensure times are full DATETIME strings
      const formattedStartTime = `${today} ${startTime}:00`; // e.g., "2025-05-28 09:00:00"
      const formattedEndTime = `${today} ${endTime}:00`;     // e.g., "2025-05-28 13:00:00"

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
exports.createDoctor = async (req, res) => {
  const {
    userId, firstName, lastName, specialty, phoneNumber, email,
    address, degree, fees, experience, about, image,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO doctor 
      (userId, firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image]
    );

    const [newDoctor] = await db.query('SELECT * FROM doctor WHERE id = ?', [result.insertId]);
    res.status(201).json(newDoctor[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create doctor' });
  }
};

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

