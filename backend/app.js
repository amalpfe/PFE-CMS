const express = require('express');
const cors = require('cors');
const PatientRoutes = require('./src/routes/PatientRoutes'); // Import the movie routes
// const AdminRoutes = require('./src/routes/AdminRoutes'); // Import the movie routes

const app = express();

app.use(express.json());
app.use(cors());
app.use('/patient', PatientRoutes);
// app.use('/admin', AdminRoutes);


const chatRoutes = require("./src/routes/ChatRoutes");
app.use("/api", chatRoutes);
// Set up the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

