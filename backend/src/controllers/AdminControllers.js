
// const axios = require('axios'); 
// const { validationResult } = require('express-validator');// controllers/signupController.js
// const bcrypt = require('bcryptjs');
// const pool = require('../../config'); // Assuming your MySQL pool is configured in config.js
// const jwt = require('jsonwebtoken');
// const upload = multer({ dest: "uploads/" }); // Set a folder for profile image uploads

//  const AddDoctor = async (req, res) => {
//   const { firstName, lastName, email, password, specialty, degree, experience, address, fees, about } = req.body;
//   const profileImage = req.file ? req.file.path : null;

//   const query = `
//     INSERT INTO doctor (firstName, lastName, email, password, specialty, degree, experience, address, fees, about, profileImage)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   pool.query(query, [firstName, lastName, email, password, specialty, degree, experience, address, fees, about, profileImage], (error, results) => {
//     if (error) {
//       return res.status(500).json({ message: "Error adding doctor", error });
//     }
//     res.status(200).json({ message: "Doctor added successfully", doctorId: results.insertId });
//   });
// };


// module.exports = {
// AddDoctor
// };