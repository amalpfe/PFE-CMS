const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const DoctorController = require('../controllers/DoctorControllers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `doctor-${req.params.id}${ext}`);
  }
});

const upload = multer({ storage });

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
router.put('/appointments/:appointmentId/complete', DoctorController.completeAppointment);


// Fetch doctor profile by doctorId
router.get('/profile/:id', DoctorController.getProfile);

// Update doctor profile by doctorId
router.put('/profile/:id', upload.single('image'), DoctorController.updateProfile);
router.post('/login', DoctorController.loginDoctor);
router.get('/patients/:doctorId', DoctorController.getPatientsByDoctorAppointments);
router.get('/patient/:patientId', DoctorController.getPatientById);
// Route to add a new medical record (POST)
router.post('/:id/medical-record', DoctorController.addMedicalRecord);
router.get('/patient/:id/medical-records', DoctorController.getMedicalRecordsByPatient);
router.get("/patient/:doctorId/patient/:patientId/medical-records", DoctorController.getMedicalRecordsByDoctorAndPatient);
// POST route to create an appointment
router.post('/appointments', DoctorController.createAppointment);
router.get("/all", DoctorController.getAllDoctors);
module.exports = router;
