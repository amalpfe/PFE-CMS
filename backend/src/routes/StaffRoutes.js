const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffControllers");

router.post("/login", StaffController.loginStaff);

router.get('/total-appointments-today', StaffController.getTotalAppointmentsToday);
router.get('/checked-in-patients', StaffController.getCheckedInPatients);
router.get('/pending-payments', StaffController.getPendingPayments);
router.get('/upcoming-appointments', StaffController.getUpcomingAppointments);
router.get('/available-doctors', StaffController.getAvailableDoctors);
// router.put("/invoices/:id", StaffController.updateInvoice);
// router.post("/invoices", StaffController.postInvoice);
// router.get("/invoices", StaffController.getInvoice);


router.get('/doctors/:doctorId/availability', StaffController.getDoctorAvailability);

router.get('/appointments',StaffController. getAppointments);
router.get('/appointments/:id', StaffController.getAppointmentById);
router.put('/appointments/:id', StaffController.updateAppointment);
router.delete('/appointments/:id', StaffController.deleteAppointment);
router.get("/patients", StaffController.getPatients);
router.get("/doctors", StaffController.getDoctors);

router.get("/payments", StaffController.getAllPayments);
router.put("/payments/:id", StaffController.updatePaymentStatus);
router.get("/availability", StaffController.getAvailability);
router.post("/availability", StaffController.addAvailability);
router.put("/availability/:id", StaffController.updateAvailability);
router.delete("/availability/:id", StaffController.deleteAvailability);
router.get("/contactus", StaffController.getContactMessages);
router.get("/appointments", StaffController.list);
router.post("/appointments", StaffController.create);
router.put("/appointments/:id", StaffController.update);
router.put("/appointments/:id/status", StaffController.updateStatus);
router.post("/create", StaffController.createStaff);

router.get('/available-appointments', StaffController.getAvailableAppointments);

module.exports = router;

module.exports = router;