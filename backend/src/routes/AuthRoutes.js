const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// These must be valid functions
router.post('/login/admin', authController.login);
router.post('/login/doctor', authController.loginDoctor);

module.exports = router;
