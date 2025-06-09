const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminControllers');


router.get('/counts', AdminController.getCounts);
router.get('/recent-appointments',AdminController.getRecentAppointments);
// Appointment routes
router.get('/appointments', AdminController.getAllAppointments);
router.put('/appointments/:id', AdminController.updateAppointmentStatus);

router.post("/doctor",AdminController.addDoctor)
router.post("/login", AdminController.loginAdmin)

// Get count of doctors (optional extra route)
router.get('/doctors/counts', AdminController.getDoctorsCount);

// Get all doctors
router.get('/doctors', AdminController.getDoctors);

// Get doctor by ID
router.get('/doctors/:id', AdminController.getDoctorById);

// Create a new doctor
router.post('/doctors', AdminController.createDoctor);

// Update doctor by ID
router.put('/doctors/:id', AdminController.updateDoctor);

// Delete doctor by ID
router.delete('/doctors/:id', AdminController.deleteDoctor);


// Route to get today's appointments
// router.get('/today-appointments', AdminController.getTodayAppointments);

// Route to get today's available doctors
// router.get('/today-doctors', AdminController.getTodayDoctors); // ✅ Don't call the function


module.exports = router;
