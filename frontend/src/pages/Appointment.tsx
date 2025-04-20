import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Doctor } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";


// Icons
import verified_icon from "../assets/verified_icon.svg";
import { InfoIcon } from "lucide-react";

function Appointment() {
  const { docId } = useParams<{ docId: string }>();

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is undefined. Make sure the component is wrapped with AppContextProvider.");
  }

  const { doctors } = context;
  const [docInfo, setDocInfo] = useState<Doctor | null>(null);

  const [docSlots, setDocSlots] = useState<Date[]>([]);
  const [slotIndex, setSlotIndex] = useState<number>(-1);
  const [slotTime, setSlotTime] = useState<string>("");

  useEffect(() => {
    const foundDoc = doctors.find((doc) => doc._id === docId) || null;
    setDocInfo(foundDoc);
  }, [doctors, docId]);

  const getAvailableSlots = () => {
    const today = new Date();
    const slots: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      slots.push(currentDate);
    }

    setDocSlots(slots);
  };

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const handleBook = () => {
    // 🔧 Placeholder: Replace with real logic
    alert(`You booked an appointment on ${slotTime} with Dr. ${docInfo?.name}`);
  };

  return docInfo ? (
    <div className="container mx-auto px-4 py-6">
      {/* Doctor Details */}
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-lg">
        <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
          <img
            src={docInfo.Image}
            alt={docInfo.name}
            className="rounded-full w-48 h-48 object-cover border-4 border-gray-300"
          />
        </div>

        <div className="lg:ml-6 flex flex-col justify-between">
          <p className="text-xl font-bold text-gray-800 flex items-center">
            {docInfo.name}
            <img src={verified_icon} alt="Verified Icon" className="ml-2 w-5 h-5" />
          </p>
          <p className="text-gray-600 mt-1">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <p className="text-gray-500 mt-1">{docInfo.experience} years of experience</p>

          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800 flex items-center">
              About <InfoIcon className="ml-2 w-5 h-5" />
            </p>
            <p className="text-gray-600 mt-2">{docInfo.about}</p>
          </div>

          <p className="text-gray-600 mt-4">
            {docInfo.address.line1}, {docInfo.address.line2}
          </p>
          <p className="text-gray-800 mt-2 font-semibold">Fees: ${docInfo.fees}</p>
        </div>
      </div>

      {/* Available Slots */}
      {docSlots.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Slots</h3>
          <div className="flex flex-wrap gap-4">
            {docSlots.map((slot, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg border ${
                  index === slotIndex ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime(slot.toDateString());
                }}
              >
                {slot.toDateString()}
              </button>
            ))}
          </div>

          {/* Selected Slot Info */}
 {slotTime && (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="mt-6 flex flex-col items-start sm:items-center"
    >
      <p className="text-gray-600 mb-3 text-sm sm:text-base">
        <span className="font-semibold text-gray-800">Selected Slot:</span> {slotTime}
      </p>

      {/* Book Appointment Button */}
      <button
        onClick={handleBook}
        className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        Book Appointment
      </button>
    </motion.div>
  </AnimatePresence>
)}


        </div>
      )}
    </div>
  ) : (
    <div className="container mx-auto px-4 py-6 text-center text-gray-500">
      Doctor not found or loading...
    </div>
  );
}

export default Appointment;
