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
function App() {

  return (
    <>
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
<<<<<<< HEAD
=======

>>>>>>> 0e76cb1dbf2520367a084f052dce0a9cb8d8c25b
        <Route path="/doctors/:speciality" element={<Doctor />} />
       <Route path="/login" element={<Login />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/my-profile" element={<MyProfile />} />
<<<<<<< HEAD
       <Route path="/my-appoitments" element={<MyAppointments />} />
      <Route path="/appointment/:docId" element={<Appointment />} />
=======
       <Route path="/my-appointments" element={<MyAppointments />} />
       <Route path="/appoitment/:docId" element={<Appointment />} />
      </Routes>
>>>>>>> 0e76cb1dbf2520367a084f052dce0a9cb8d8c25b

      </Routes>
        <Footer />
    </div>
    </>
  )
}

export default App
