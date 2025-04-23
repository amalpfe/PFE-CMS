import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Doctor } from "../assets/assets";

import verified_icon from "../assets/verified_icon.svg";
import { InfoIcon } from "lucide-react";
import RelatedDoctors from "../components/RelatedDoctors";

interface TimeSlot {
  datetime: Date;
  time: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function Appointment() {
  const { docId } = useParams<{ docId: string }>();
  const context = useContext(AppContext);

  if (!context) throw new Error("AppContext is undefined.");

  const { doctors } = context;

  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>({});
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    console.log("Doctors:", doctors); // Check if doctors are loaded
    const foundDoc = doctors.find((doc) => doc._id === docId) || null;
    setDocInfo(foundDoc);
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) generateSlots();
  }, [docInfo]);

  const generateSlots = () => {
    const now = new Date();
    const groupedSlots: Record<string, TimeSlot[]> = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(now.getDate() + i);
      day.setHours(10, 0, 0, 0);

      const dateLabel = formatDate(day);
      groupedSlots[dateLabel] = [];

      const end = new Date(day);
      end.setHours(21, 0, 0, 0);

      while (day < end) {
        if (i > 0 || day > now) {
          groupedSlots[dateLabel].push({
            datetime: new Date(day),
            time: day.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }
        day.setMinutes(day.getMinutes() + 30);
      }
    }

    setTimeSlots(groupedSlots);
  };

  if (!docInfo) {
    return <div className="text-center text-gray-500 py-10">Loading doctor info...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Doctor Info */}
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
          <img
            src={docInfo.Image}
            alt={docInfo.name}
            className="rounded-full w-48 h-48 object-cover border-4 border-gray-300"
          />
        </div>
        <div className="lg:ml-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            {docInfo.name}
            <img src={verified_icon} alt="verified" className="ml-2 w-5 h-5" />
          </h2>
          <p className="text-gray-600 mt-1">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <p className="text-gray-500">{docInfo.experience} years experience</p>

          <div className="mt-4">
            <p className="text-lg font-semibold flex items-center">
              About <InfoIcon className="ml-2 w-5 h-5" />
            </p>
            <p className="text-gray-600 mt-2">{docInfo.about}</p>
          </div>

          <p className="text-gray-600 mt-4">
            {docInfo.address.line1}, {docInfo.address.line2}
          </p>
          <p className="font-semibold text-gray-800 mt-2">Fees: ${docInfo.fees}</p>
        </div>
      </div>

      {/* Time Slots */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose a time slot</h3>
        {Object.entries(timeSlots).map(([dateLabel, slots]) => (
          <div key={dateLabel} className="mb-6">
            <h4 className="text-md font-medium text-blue-600 mb-2">{dateLabel}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  className={`py-2 px-4 text-sm rounded-lg border transition ${
                    selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Selected Slot Summary + Related Doctors */}
        {selectedSlot && (
          <>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-200">
              <p className="text-blue-700 mb-3 sm:mb-0">
                <strong>Selected:</strong> {formatDate(selectedSlot.datetime)} at {selectedSlot.time}
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md shadow"
                onClick={() =>
                  alert(`Appointment booked for ${formatDate(selectedSlot.datetime)} at ${selectedSlot.time}`)
                }
              >
                Confirm Appointment
              </button>
            </div>

            {/* ✅ Render only if docId is defined */}
            {docId && (
              <div className="mt-10">
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Appointment;
