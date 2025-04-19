import { useContext } from "react";
import { AppContext, Doctor } from "../context/AppContext";
import { motion } from "framer-motion";

// Animation variants for fade-in effect
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const MyAppointments = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <p className="text-red-600 text-center mt-10">Context not found!</p>;
  }

  const { doctors } = context;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
      <p className="text-2xl font-bold text-purple-800 pb-4 border-b mb-8">
        My Appointments
      </p>

      {doctors.slice(0, 2).map((doctor: Doctor, index: number) => (
        <motion.div
          key={index}
          className="grid sm:grid-cols-[1fr_2fr_auto] gap-6 items-center py-6 border-b"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Doctor Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 bg-indigo-50">
            <img
              src={doctor.Image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Doctor Info */}
          <div>
            <p className="text-lg font-semibold text-neutral-800">{doctor.name}</p>
            <p className="text-sm text-gray-500 mb-2">{doctor.speciality}</p>
            <div className="text-sm text-gray-700">
              <p className="font-medium text-zinc-700">Address:</p>
              <p className="text-xs">{doctor.address.line1}</p>
              <p className="text-xs">{doctor.address.line2}</p>
            </div>
            <p className="text-sm mt-3">
              <span className="text-neutral-700 font-medium">Date & Time:</span> 18, April, 2025 | 8:30 PM
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button className="text-sm text-purple-700 border border-purple-500 py-2 rounded hover:bg-purple-700 hover:text-white transition-all duration-300">
              Pay Online
            </button>
            <button className="text-sm text-red-600 border border-red-500 py-2 rounded hover:bg-red-700 hover:text-white transition-all duration-300">
              Cancel Appointment
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MyAppointments;
