import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Appointments from "./pages/appointment";
import Doctors from "./pages/doctor";
import DoctorList from "./pages/doctorlist";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50"> {/* Fullscreen container */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor-list" element={<DoctorList />} />
      </Routes>
    </div>
  );
}

export default App;
