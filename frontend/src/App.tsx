import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Navbar from "./components/Navbar";
import Footer from "./components/Fotter";
import Appointment from "./pages/Appointment";
import Careers from "./pages/careers";
import Assistant from "./pages/Assistant"
import SignUp from "./pages/Signup";
import Review from "./pages/Review"
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
function App() {
  return (
    <>
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/doctors/:speciality" element={<Doctor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/medical-reports" element={<Reports />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/my-profile/:id" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/review/:appointmentId/:patientId/:doctorName" element={<Review />} />

          <Route path="/careers" element={<Careers />} />  {/* Careers route */}
          <Route path="/notifications" element={<Notifications />} />  
          
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;