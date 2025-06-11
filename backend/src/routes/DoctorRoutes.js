const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const DoctorController = require('../controllers/DoctorControllers');

const router = express.Router();
//new

router.post("/createdoctor", DoctorController.createDoctor);

// router.get('/profile', verifyToken, DoctorController.getProfile);

//////////////////
// Doctor Dashboard
router.get("/:id/dashboard", DoctorController.getDoctorDashboard);

// Detailed appointments must be **before** the general appointments route
router.get('/:id/appointments/detailed', DoctorController.getAppointmentsByDoctor);

// Route to get basic appointments for a specific doctor
router.get("/:id/appointments", DoctorController.getDoctorAppointments);
router.put('/appointments/:appointmentId/cancel', DoctorController.cancelAppointment);

// Fetch doctor profile by doctorId
router.get('/profile/:id', DoctorController.getProfile);

// Update doctor profile by doctorId
router.put('/profile/:id', DoctorController.updateProfile);
router.post('/login', DoctorController.loginDoctor);
router.get('/patients/:doctorId', DoctorController.getPatientsByDoctorAppointments);


module.exports = router;
