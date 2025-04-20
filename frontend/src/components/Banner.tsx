import { useNavigate } from 'react-router-dom';
import appointmentImg from '../assets/appointment_img.png';

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-2xl px-6 md:px-10 lg:px-20 my-20 md:mx-10 shadow-xl overflow-hidden">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-14 md:py-[8vw] text-white z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
          Book Appointment <br />
           With Trusted Doctors
        </h1>
      <button onClick={()=>{navigate('/login'); scrollTo(0,0)}}
         className="flex items-center gap-2 bg-white px-6 py-3 rounded-full text-purple-700 text-sm font-medium hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Create Account
       </button>
      </div>

      {/* Right side */}
          <div className="hidden md:block md:w-1/2 lg:w-[370px] relative ">
        <img
          className="w-full absolute bottom-0 right-0  max-w-md object-contain rounded-b-xl md:absolute md:bottom-0 drop-shadow-2xl"
          alt="doctor group"
          src={appointmentImg} // This can be replaced with a relevant image for the right side
        />
      </div>
    </div>
  );
};

export default Banner;
