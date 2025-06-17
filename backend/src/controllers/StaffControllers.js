const db = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Make sure it's defined in your .env file


exports.createStaff = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
    password,
    dateOfBirth,
    hiringDate,
    image,
  } = req.body;

  try {
    // Check if username or email already exists
    const [existing] = await db.execute(
      "SELECT id FROM staff WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new staff
    await db.execute(
      `INSERT INTO staff
      (firstName, lastName, phoneNumber, email, username, passwordHash, dateOfBirth, hiringDate, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        phoneNumber,
        email,
        username,
        passwordHash,
        dateOfBirth || null,
        hiringDate || null,
        image || null,
      ]
    );

    res.status(201).json({ message: "Staff member created successfully." });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM staff WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff not found." });
    }

    const staff = rows[0];

    const isMatch = await bcrypt.compare(password, staff.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: staff.id, role: "Staff", username: staff.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

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


// // GET all invoices
// exports.getInvoice = async (req, res) => {
//   try {
//     const [rows] = await db.execute(`
//       SELECT 
//         billing.id,
//         CONCAT(p.firstName, ' ', p.lastName) AS patientName,
//         billing.amount,
//         billing.paymentStatus AS status,
//         billing.createdAt AS issuedDate,
//         billing.updatedAt AS dueDate,
//         CONCAT('Appointment ID: ', billing.appointmentId) AS description
//       FROM billing
//       JOIN patient p ON p.id = billing.patientId
//     `);
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     res.status(500).json({ error: "Failed to fetch invoices" });
//   }
// };

// // POST new invoice
// exports.postInvoice = async (req, res) => {
//   const { patientName, amount, description, issuedDate, dueDate } = req.body;
//   try {
//     // Lookup patient ID by name
//     const [patientRows] = await db.execute(
//       "SELECT id FROM patient WHERE CONCAT(firstName, ' ', lastName) = ? LIMIT 1",
//       [patientName]
//     );

//     if (patientRows.length === 0) {
//       return res.status(400).json({ error: "Patient not found" });
//     }

//     const patientId = patientRows[0].id;

//     await db.execute(
//       `INSERT INTO billing (patientId, appointmentId, amount, paymentStatus, paymentMethod, createdAt, updatedAt) 
//        VALUES (?, ?, ?, 'Pending', 'Cash', ?, ?)`,
//       [patientId, 1, amount, issuedDate, dueDate] // dummy appointmentId = 1, adjust if needed
//     );

//     res.status(201).json({ message: "Invoice created" });
//   } catch (error) {
//     console.error("Error creating invoice:", error);
//     res.status(500).json({ error: "Failed to create invoice" });
//   }
// };

// // UPDATE invoice status
// exports.updateInvoice = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     await db.execute(
//       "UPDATE billing SET paymentStatus = ?, updatedAt = NOW() WHERE id = ?",
//       [status, id]
//     );
//     res.json({ message: "Invoice updated" });
//   } catch (error) {
//     console.error("Error updating invoice:", error);
//     res.status(500).json({ error: "Failed to update invoice" });
//   }
// };


exports.getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.id, b.appointmentId, b.amount, b.paymentStatus, b.paymentMethod, b.createdAt,
             p.firstName AS patientName, d.firstName AS doctorName, a.appointmentDate
      FROM billing b
      JOIN appointment a ON a.id = b.appointmentId
      JOIN patient p ON p.id = b.patientId
      JOIN doctor d ON d.id = a.doctorId
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Fetch billing error:", error);
    res.status(500).json({ message: "Error fetching billing records" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    await db.execute("UPDATE billing SET paymentStatus = ?, updatedAt = NOW() WHERE id = ?", [
      paymentStatus,
      id,
    ]);
    res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
};
// src/controllers/DoctorAvailabilityController.js

// Get all availability with doctor name
exports.getAvailability = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        da.id, da.doctorId, CONCAT(d.firstName, ' ', d.lastName) AS doctorName,
        da.dayOfWeek, da.startTime, da.endTime
      FROM doctoravailability da
      JOIN doctor d ON d.id = da.doctorId
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching availability" });
  }
};

// Add
exports.addAvailability = async (req, res) => {
  const { doctorId, dayOfWeek, startTime, endTime } = req.body;
  try {
    await db.execute(
      "INSERT INTO doctoravailability (doctorId, dayOfWeek, startTime, endTime) VALUES (?, ?, ?, ?)",
      [doctorId, dayOfWeek, startTime, endTime]
    );
    res.status(201).json({ message: "Availability added" });
  } catch (err) {
    res.status(500).json({ message: "Error inserting availability" });
  }
};

// Update
exports.updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { doctorId, dayOfWeek, startTime, endTime } = req.body;
  try {
    await db.execute(
      "UPDATE doctoravailability SET doctorId = ?, dayOfWeek = ?, startTime = ?, endTime = ? WHERE id = ?",
      [doctorId, dayOfWeek, startTime, endTime, id]
    );
    res.json({ message: "Availability updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating availability" });
  }
};

// Delete
exports.deleteAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM doctoravailability WHERE id = ?", [id]);
    res.json({ message: "Availability deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting availability" });
  }
};
// src/controllers/StaffController.js


// Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, name, email, message, created_at
      FROM contactus
      ORDER BY created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Failed to retrieve contact messages." });
  }
};

// src/controllers/StaffAppointmentsController.js

exports.list = async (_, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, a.patientId, CONCAT(p.firstName, " ", p.lastName) AS patientName,
             a.doctorId, CONCAT(d.firstName, " ", d.lastName) AS doctorName,
             DATE_FORMAT(a.appointmentDate, "%Y-%m-%d %H:%i") AS appointmentDate,
             a.appointmentStatus, a.notes
      FROM appointment a
      JOIN patient p ON p.id = a.patientId
      JOIN doctor d ON d.id = a.doctorId
      ORDER BY a.appointmentDate DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to query appointments" });
  }
};

exports.get = async (req, res) => {
  const { id } = req.params;
  // similar to list but with WHERE id
};

exports.create = async (req, res) => {
  const { patientId, doctorId, appointmentDate, notes, appointmentStatus } = req.body;
  try {
    await db.execute(`
      INSERT INTO appointment
        (patientId, doctorId, appointmentDate, notes, appointmentStatus)
      VALUES (?, ?, ?, ?, ?)
    `, [patientId, doctorId, appointmentDate, notes, appointmentStatus]);
    res.status(201).json({ message: "Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Create failed" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { patientId, doctorId, appointmentDate, notes, appointmentStatus } = req.body;
  try {
    await db.execute(`
      UPDATE appointment
      SET patientId=?, doctorId=?, appointmentDate=?, notes=?, appointmentStatus=?, updatedAt=NOW()
      WHERE id=?
    `, [patientId, doctorId, appointmentDate, notes, appointmentStatus, id]);
    res.json({ message: "Updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.execute(`
      UPDATE appointment
      SET appointmentStatus=?, updatedAt=NOW()
      WHERE id=?
    `, [status, id]);
    res.json({ message: "Status updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Update status failed" });
  }
};
