const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// const authRoutes=require('./src/routes/AuthRoutes')
const PatientRoutes = require('./src/routes/PatientRoutes');
const AdminRoutes = require('./src/routes/AdminRoutes');
const DoctorRoutes=require('./src/routes/DoctorRoutes');
const StaffRoutes=require('./src/routes/StaffRoutes');
const chatRoutes = require("./src/controllers/ChatControllers");
const app = express();
<<<<<<< HEAD
app.use(cors());
// ✅ Enhanced CORS setup
// app.use(cors({
//   origin: 'http://localhost:5175', // React Vite frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // only needed if using cookies/auth headers
// }));

// ✅ Middlewares
=======

>>>>>>> 1d83ae6e21cf6ecac8989dac97f539d94c7ea031
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname,'src','uploads')));

app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/auth', authRoutes);
app.use('/patient', PatientRoutes);
app.use('/admin', AdminRoutes);
app.use('/doctor',DoctorRoutes);
app.use("/staff", StaffRoutes);

console.log('JWT_SECRET is:', process.env.JWT_SECRET);


// app.use("/api", chatRoutes);
app.use('/api', chatRoutes);

// ✅ Add this route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
