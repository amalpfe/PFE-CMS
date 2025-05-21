const express = require('express');
const cors = require('cors');
const PatientRoutes = require('./src/routes/PatientRoutes');
const AdminRoutes = require('./src/routes/AdminRoutes');
const DoctorRoutes=require('./src/routes/DoctorRoutes')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/patient', PatientRoutes);
app.use('/admin', AdminRoutes);
app.use('/doctor',DoctorRoutes)

const chatRoutes = require("./src/routes/ChatRoutes");
app.use("/api", chatRoutes);


// ✅ Add this route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
