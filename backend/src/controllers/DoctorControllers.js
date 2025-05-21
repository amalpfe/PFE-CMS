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



// GET /doctor/:id/profile
exports.getProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `
      SELECT id, userId, firstName, lastName, specialty, phoneNumber, email, address, degree, fees, experience, about, image, createdAt, updatedAt
      FROM doctor
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


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
    about,
    image,
  } = req.body;

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
        image = ?
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
      image,
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
