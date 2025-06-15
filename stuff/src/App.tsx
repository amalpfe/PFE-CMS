import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login'; // Import Login page

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes wrapped in Layout */}
      <Route
        path="/"
        element={<Layout><Dashboard /></Layout>}
      />
      <Route
        path="/dashboard"
        element={<Layout><Dashboard /></Layout>}
      />
      
      {/* Example for appointments page */}
      {/* <Route path="/appointments" element={<Layout><Appointments /></Layout>} /> */}
    </Routes>
  );
}

export default App;
