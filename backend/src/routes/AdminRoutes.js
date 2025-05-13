// routes/AdminRoutes.js
const express = require('express');
const router = express.Router();
const { HandleLogin } = require('../controllers/AdminControllers'); // adjust the path

router.post('/login', HandleLogin);

module.exports = router;
