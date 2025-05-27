const express = require('express');
const DoctorController = require('../controllers/DoctorControllers');

const router = express.Router();

// Doctor Dashboard
router.get("/:id/dashboard", DoctorController.getDoctorDashboard);

// Detailed appointments must be **before** the general appointments route
router.get('/:id/appointments/detailed', DoctorController.getAppointmentsByDoctor);

// Route to get basic appointments for a specific doctor
router.get("/:id/appointments", DoctorController.getDoctorAppointments);

// Fetch doctor profile by doctorId
router.get('/profile/:id', DoctorController.getProfile);

// Update doctor profile by doctorId
router.put('/profile/:id', DoctorController.updateProfile);

module.exports = router;
