const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffControllers");

router.post("/login", StaffController.loginStaff);

router.get('/total-appointments-today', StaffController.getTotalAppointmentsToday);
router.get('/checked-in-patients', StaffController.getCheckedInPatients);
router.get('/pending-payments', StaffController.getPendingPayments);
router.get('/upcoming-appointments', StaffController.getUpcomingAppointments);
router.get('/available-doctors', StaffController.getAvailableDoctors);


router.get('/doctors/:doctorId/availability', StaffController.getDoctorAvailability);

router.get('/appointments',StaffController. getAppointments);
router.get('/appointments/:id', StaffController.getAppointmentById);
router.put('/appointments/:id', StaffController.updateAppointment);
router.delete('/appointments/:id', StaffController.deleteAppointment);
router.get("/patients", StaffController.getPatients);
router.get("/doctors", StaffController.getDoctors);
module.exports = router;