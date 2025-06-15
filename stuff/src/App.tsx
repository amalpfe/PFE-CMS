import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login'; // Import Login page
import Appointment from './pages/appointment';

function App() {
  return (
      <div className="min-h-screen w-full bg-gray-50"> 
    <Routes>
      {/* Public route */}

      {/* Protected routes wrapped in Layout */}
      <Route path="/" element={<Login />}/>
      <Route path="/staff/dashboard" element={<Dashboard />}/>
      <Route path="/staff/appointments" element={<Appointment />}/>
    </Routes>
    </div>
  );
}

export default App;
