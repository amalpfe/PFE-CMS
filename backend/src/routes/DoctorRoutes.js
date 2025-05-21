const express = require('express');
const DoctorController = require('../controllers/DoctorControllers');

const { login } = require('../controllers/AdminControllers');

const router = express.Router();

// Doctor login route
// router.post('/login', login);
//Doctor Dashboard
router.get("/:id/dashboard", DoctorController.getDoctorDashboard);
// Route to get appointments for a specific doctor
router.get("/:id/appointments", DoctorController.getDoctorAppointments);

// Fetch doctor profile by doctorId
router.get('/profile/:id', DoctorController.getProfile);


// Update doctor profile by doctorId
router.put('/profile/:id', DoctorController.updateProfile);
module.exports = router;
