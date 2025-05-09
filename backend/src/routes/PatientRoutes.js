// routes/signup.js
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/PatientControllers');

router.post('/signup', Controller.handleSignup);
router.post('/login', Controller.handleLogin);

module.exports = router;
