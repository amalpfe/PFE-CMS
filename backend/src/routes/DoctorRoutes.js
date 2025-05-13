const express = require('express');
const { login } = require('../controllers/AdminControllers');

const router = express.Router();

// Doctor login route
router.post('/login', login);

module.exports = router;
