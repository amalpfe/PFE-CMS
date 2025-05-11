// routes/signup.js
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/PatientControllers');

router.post('/signup', Controller.handleSignup);
router.post('/appointment', Controller.handleApp);
router.post('/login', Controller.handleLogin);
router.get('/doctors', Controller.getAllDoctors);
router.get("/doctor/:id", Controller.getDoctorDetails);
router.post("/add", Controller.addReview);
router.get("/appointments/:patientId", Controller.getAppointmentsByPatient);
router.get("/profile/:userId", Controller.getProfile);
module.exports = router;
