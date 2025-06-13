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
import PatientList from "./pages/patientlist";
import DoctorPatientList from './pages/doctorpatientlist';
function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50"> {/* Fullscreen container */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/doctors" element={<Doctors />} />
        <Route path="/admin/doctor-list" element={<DoctorList />} />
        <Route path="/admin/patient-list" element={<PatientList />} />
        {/* <Route path="/doctor/dashboard" element={<DoctorLayout children={undefined} />} /> */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/patients" element={<DoctorPatientList />} />
        {/* <Route path="/doctor/patients/:id" element={<PatientProfile />} />
        <Route path="/doctor/medical-records" element={<MedicalRecords />} />
        <Route path="/doctor/prescriptions" element={<PrescriptionList />} /> */}
        {/* <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="analytics" element={<PracticeAnalytics />} />
        <Route path="telemedicine" element={<TelemedicineDashboard />} />
        <Route path="settings" element={<DoctorSettings />} />
        <Route path="billing" element={<BillingDashboard />} /> */}
      </Routes>
    </div>
  );
}

export default App;
