const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register); 
router.post('/login/admin', authController.login);
router.post('/login/doctor', authController.loginDoctor);
module.exports = router;
