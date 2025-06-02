import { useNavigate } from 'react-router-dom';
import grp from '../assets/grpimage.png';
import arrow from '../assets/arrow.png';
import header from '../assets/drgrp.png';

function Header() {
  const navigate = useNavigate();



  const handleBookingClick = () => {
 
      navigate('/doctors');
    
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-2xl px-6 md:px-10 lg:px-20 shadow-xl overflow-hidden relative">
      
   

      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-14 md:py-[8vw] text-white z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
          Book Appointment <br /> With Trusted Doctors
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-base font-light">
          <img src={grp} alt="group" className="w-20 h-auto" />
          <p className="text-sm md:text-base">
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>

        <button
          onClick={handleBookingClick}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-full text-purple-700 text-sm font-medium hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Book Appointment <img className="w-4" src={arrow} alt="arrow" />
        </button>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 relative flex items-end justify-center">
        <img
          className="w-full md:w-[90%] max-h-[450px] object-contain rounded-b-xl md:absolute md:bottom-0 drop-shadow-2xl"
          src={header}
          alt="doctor group"
        />
      </div>
    </div>
  );
}

export default Header;
