const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffControllers");

router.post("/login", StaffController.loginStaff);

router.get('/total-appointments-today', StaffController.getTotalAppointmentsToday);
router.get('/checked-in-patients', StaffController.getCheckedInPatients);
router.get('/pending-payments', StaffController.getPendingPayments);
router.get('/upcoming-appointments', StaffController.getUpcomingAppointments);
router.get('/available-doctors', StaffController.getAvailableDoctors);

module.exports = router;