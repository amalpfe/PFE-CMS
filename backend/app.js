const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const PatientRoutes = require('./src/routes/PatientRoutes');
const AdminRoutes = require('./src/routes/AdminRoutes');
const DoctorRoutes = require('./src/routes/DoctorRoutes');
const StaffRoutes = require('./src/routes/StaffRoutes');
const chatRoutes = require("./src/controllers/ChatControllers");

const app = express();
app.use(cors());
// ✅ Enhanced CORS setup
// app.use(cors({
//   origin: 'http://localhost:5175', // React Vite frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // only needed if using cookies/auth headers
// }));

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Optional redundancy

// ✅ Routes
app.use('/patient', PatientRoutes);
app.use('/admin', AdminRoutes);
app.use('/doctor', DoctorRoutes);
app.use('/staff', StaffRoutes);
app.use('/api', chatRoutes);

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API');
});

// ✅ Debug JWT_SECRET
console.log('JWT_SECRET is:', process.env.JWT_SECRET);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
