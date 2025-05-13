// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginAdmin, loginDoctor } = require("../controllers/AuthController");

router.post("/admin/login", loginAdmin);
router.post("/doctor/login", loginDoctor);

module.exports = router;
