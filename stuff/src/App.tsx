import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login'; // Import Login page
import Appointment from './pages/appointment';
import Doctor from './pages/doctor';
import Patients from './pages/patients';
import Payments from './pages/payments';
import Reports from './pages/contactus';

function App() {
  return (
      <div className="min-h-screen w-full bg-gray-50"> 
    <Routes>
      {/* Public route */}

      {/* Protected routes wrapped in Layout */}
      <Route path="/" element={<Login />}/>
      <Route path="/staff/dashboard" element={<Dashboard />}/>
      <Route path="/staff/appointments" element={<Appointment />}/>
      <Route path="/staff/doctors" element={<Doctor />}/>
      <Route path="/staff/patients" element={<Patients />}/>
      <Route path="/staff/payments" element={<Payments />}/>
      <Route path="/staff/reports" element={<Reports />}/>
    </Routes>
    </div>
  );
}

export default App;
