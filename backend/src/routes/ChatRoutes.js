const express = require("express");
require("dotenv").config();

const router = express.Router();
const controller = require("../controllers/ChatControllers");


router.post('/gemini', controller.gemini);

module.exports = router;
