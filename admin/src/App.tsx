import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Appointments from "./pages/appointment";
import Doctors from "./pages/doctor";
import DoctorList from "./pages/doctorlist";
// import DoctorLayout from "./components/DoctorLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorProfile from "./pages/DoctorProfile";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50"> {/* Fullscreen container */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/doctor-list" element={<DoctorList />} />

        {/* <Route path="/doctor/dashboard" element={<DoctorLayout children={undefined} />} /> */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
      </Routes>
    </div>
  );
}

export default App;
