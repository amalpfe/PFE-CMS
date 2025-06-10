// routes/signup.js
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/PatientControllers');
const protect = require('../middlewares/auth'); // أو اسم الملف عندك

router.get('/profile/:id', Controller.getProfile);
router.post('/signup', Controller.handleSignup);
router.post('/contact', Controller.contactUs);
router.post('/appointment', Controller.handleApp);
router.post('/login', Controller.handleLogin);
router.post("/add", Controller.addReview);
router.post("/feedback", Controller.submitFeedback);

router.get('/doctors', Controller.getAllDoctors);
router.get("/doctor/:id", Controller.getDoctorDetails);
router.get("/appointments/:patientId", Controller.getAppointmentsByPatient);

router.get("/reports/:patientId", Controller.getMedicalRecordsByPatientId);
router.get("/:patientId/lab-results", Controller.getLabResults);

router.put("/profile/:id" , Controller.UpdateProfile);
router.put("/cancel-appointment/:appointmentId", Controller.cancelAppointment);

// GET all patients
router.get("/patients", Controller.getAllPatients);

// DELETE patient by ID
router.delete("/patients/:id", Controller.deletePatient);

// UPDATE patient by ID
router.put("/patients/:id", Controller.updatePatient);

module.exports = router;
