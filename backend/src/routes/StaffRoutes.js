const express = require("express");
const router = express.Router();
const StaffController = require("../controllers/StaffControllers");

router.post("/login", StaffController.loginStaff);
module.exports = router;