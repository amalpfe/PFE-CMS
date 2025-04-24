// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { Doctor } from "../assets/assets";

// import verified_icon from "../assets/verified_icon.svg";
// import { InfoIcon } from "lucide-react";
// import RelatedDoctors from "../components/RelatedDoctors";

// interface TimeSlot {
//   datetime: Date;
//   time: string;
// }

// function formatDate(date: Date): string {
//   return date.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });
// }

// function Appointment() {
//   const { docId } = useParams<{ docId: string }>();
//   const context = useContext(AppContext);

//   if (!context) throw new Error("AppContext is undefined.");

//   const { doctors } = context;

//   const [docInfo, setDocInfo] = useState<Doctor | null>(null);
//   const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>({});
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

//   useEffect(() => {
//     console.log("Doctors:", doctors); // Check if doctors are loaded
//     const foundDoc = doctors.find((doc) => doc._id === docId) || null;
//     setDocInfo(foundDoc);
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) generateSlots();
//   }, [docInfo]);

//   const generateSlots = () => {
//     const now = new Date();
//     const groupedSlots: Record<string, TimeSlot[]> = {};

//     for (let i = 0; i < 7; i++) {
//       const day = new Date();
//       day.setDate(now.getDate() + i);
//       day.setHours(10, 0, 0, 0);

//       const dateLabel = formatDate(day);
//       groupedSlots[dateLabel] = [];

//       const end = new Date(day);
//       end.setHours(21, 0, 0, 0);

//       while (day < end) {
//         if (i > 0 || day > now) {
//           groupedSlots[dateLabel].push({
//             datetime: new Date(day),
//             time: day.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//           });
//         }
//         day.setMinutes(day.getMinutes() + 30);
//       }
//     }

//     setTimeSlots(groupedSlots);
//   };

//   if (!docInfo) {
//     return <div className="text-center text-gray-500 py-10">Loading doctor info...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Doctor Info */}
//       <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
//         <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
//           <img
//             src={docInfo.Image}
//             alt={docInfo.name}
//             className="rounded-full w-48 h-48 object-cover border-4 border-gray-300"
//           />
//         </div>
//         <div className="lg:ml-6">
//           <h2 className="text-xl font-bold text-gray-800 flex items-center">
//             {docInfo.name}
//             <img src={verified_icon} alt="verified" className="ml-2 w-5 h-5" />
//           </h2>
//           <p className="text-gray-600 mt-1">
//             {docInfo.degree} - {docInfo.speciality}
//           </p>
//           <p className="text-gray-500">{docInfo.experience} years experience</p>

//           <div className="mt-4">
//             <p className="text-lg font-semibold flex items-center">
//               About <InfoIcon className="ml-2 w-5 h-5" />
//             </p>
//             <p className="text-gray-600 mt-2">{docInfo.about}</p>
//           </div>

//           <p className="text-gray-600 mt-4">
//             {docInfo.address.line1}, {docInfo.address.line2}
//           </p>
//           <p className="font-semibold text-gray-800 mt-2">Fees: ${docInfo.fees}</p>
//         </div>
//       </div>

//       {/* Time Slots */}
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose a time slot</h3>
//         {Object.entries(timeSlots).map(([dateLabel, slots]) => (
//           <div key={dateLabel} className="mb-6">
//             <h4 className="text-md font-medium text-blue-600 mb-2">{dateLabel}</h4>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//               {slots.map((slot, index) => (
//                 <button
//                   key={index}
//                   className={`py-2 px-4 text-sm rounded-lg border transition ${
//                     selectedSlot?.datetime.getTime() === slot.datetime.getTime()
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200 text-gray-800"
//                   }`}
//                   onClick={() => setSelectedSlot(slot)}
//                 >
//                   {slot.time}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Selected Slot Summary + Related Doctors */}
//         {selectedSlot && (
//           <>
//             <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-200">
//               <p className="text-blue-700 mb-3 sm:mb-0">
//                 <strong>Selected:</strong> {formatDate(selectedSlot.datetime)} at {selectedSlot.time}
//               </p>
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md shadow"
//                 onClick={() =>
//                   alert(`Appointment booked for ${formatDate(selectedSlot.datetime)} at ${selectedSlot.time}`)
//                 }
//               >
//                 Confirm Appointment
//               </button>
//             </div>

//             {/* ✅ Render only if docId is defined */}
//             {docId && (
//               <div className="mt-10">
//                 <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Appointment;

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import verifiedIcon from "../assets/verified_icon.svg";
import infoIcon from "../assets/info_icon.svg";
import { Doctor } from "../context/AppContext";

function Appointment() {
  const { docId } = useParams();
  const context = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [docSlots, setDocSlots] = useState<
    { datetime: Date; time: string }[][]
  >([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const getAvailableSlots = async () => {
    const today = new Date();
    const newSlots: { datetime: Date; time: string }[][] = [];

    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      let startTime = new Date(date);
      let endTime = new Date(date);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const now = new Date();
        startTime.setHours(now.getHours() > 10 ? now.getHours() + 1 : 10);
        startTime.setMinutes(now.getMinutes() > 30 ? 30 : 0);
      } else {
        startTime.setHours(10, 0, 0, 0);
      }

      const daySlots: { datetime: Date; time: string }[] = [];
      while (startTime < endTime) {
        daySlots.push({
          datetime: new Date(startTime),
          time: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      newSlots.push(daySlots);
    }

    setDocSlots(newSlots);
  };

  useEffect(() => {
    if (context) {
      const found = context.doctors.find((doc) => doc._id === docId);
      setDocInfo(found || null);
    }
  }, [context, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    setSlotTime("");
  }, [slotIndex]);

  const handleBooking = () => {
    if (!slotTime) return;

    // Here you could send the selected datetime to a backend if needed

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (!context || !docInfo) return null;

  const { currencySymbol } = context;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-purple-600 w-full sm:max-w-72 rounded-lg"
            src={docInfo.Image}
            alt="doctor"
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img src={verifiedIcon} alt="verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={infoIcon} alt="info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>
          <p>
            Appointment fee:
            <span className="text-gray-900">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>

        {/* Days Row */}
        <div className="flex gap-3 items-center w-full mt-4 overflow-x-scroll scrollbar-hide">
          {docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? "bg-purple-600 text-white"
                  : "border border-gray-200"
              }`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time Slots Row */}
        <div className="flex items-center gap-3 w-full mt-4 overflow-x-scroll scrollbar-hide">
          {docSlots[slotIndex] &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* Booking Button */}
        <button
          onClick={handleBooking}
          disabled={!slotTime}
          className={`${
            slotTime
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white text-sm font-light px-14 py-3 rounded-full my-6 transition duration-200`}
        >
          Book an appointment
        </button>

        {/* Success Message */}
        {showSuccess && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="animate-fade-in-up text-green-800 bg-green-100 border border-green-300 rounded-lg px-6 py-4 shadow-lg text-center max-w-lg w-full mx-4">
      <p className="text-lg font-medium">
        Appointment confirmed for{" "}
        <strong>
          {docSlots[slotIndex][0].datetime.toDateString()} at {slotTime}
        </strong>
        .
      </p>
      <p className="text-sm mt-1 text-green-700">
        Thank you for booking with us. We look forward to seeing you!
      </p>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

export default Appointment;




