import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import verifiedIcon from "../assets/verified_icon.svg";
import infoIcon from "../assets/info_icon.svg";
import { FaStar } from "react-icons/fa";
import RelatedDoctors from "../components/RelatedDoctors";

interface DoctorAvailability {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  degree: string;
  specialty: string;
  fees: number;
  experience: number;
  about: string;
  image: string;
  availability: DoctorAvailability[];
}

function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [docSlots, setDocSlots] = useState<{ datetime: Date; time: string }[][]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Hardcoded patientId for demo — replace with auth state/context
  const [patientId] = useState(1);

  const currencySymbol = "$";
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/patient/doctor/${docId}`);
        setDocInfo(response.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    if (docId) {
      fetchDoctorDetails();
    }
  }, [docId]);

  const getAvailableSlots = () => {
    if (!docInfo?.availability) return;

    const today = new Date();
    const newSlots: { datetime: Date; time: string }[][] = [];

    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const availability = docInfo.availability.find(
        (slot) => slot.dayOfWeek.toLowerCase() === dayName.toLowerCase()
      );

      if (!availability) {
        newSlots.push([]);
        continue;
      }

      const start = new Date(date);
      const [startHour, startMinute] = availability.startTime.split(":").map(Number);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(date);
      const [endHour, endMinute] = availability.endTime.split(":").map(Number);
      end.setHours(endHour, endMinute, 0, 0);

      const slots: { datetime: Date; time: string }[] = [];
      const isToday = i === 0;
      const now = new Date();

      while (start < end) {
        if (!isToday || start > now) {
          slots.push({
            datetime: new Date(start),
            time: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }
        start.setMinutes(start.getMinutes() + 30);
      }

      newSlots.push(slots);
    }

    setDocSlots(newSlots);
  };

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    setSlotTime("");
  }, [slotIndex]);

 const handleBooking = async () => {
  if (!slotTime || !docSlots[slotIndex]?.length) return;

  const selectedDate = new Date(docSlots[slotIndex][0].datetime);
  const [hour, minute] = slotTime.split(":").map((val) => parseInt(val));
  selectedDate.setHours(hour, minute, 0, 0);

  try {
    const response = await axios.post("http://localhost:5000/patient/appointment", {
      patientId,
      doctorId: docInfo?.id,
      appointmentDate: selectedDate.toISOString().slice(0, 19).replace("T", " "),
    });

    if (response.status === 201) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to book appointment. Please try again.";
    alert(message); // Or use a toast notification
  }
};
  if (!docInfo) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            src={
              docInfo.image.startsWith("data:")
                ? docInfo.image
                : `data:image/png;base64,${docInfo.image}`
            }
            alt="doctor"
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.firstName} {docInfo.lastName}
            <img src={verifiedIcon} alt="verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.specialty}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience} yrs
            </button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={infoIcon} alt="info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p>
            Appointment fee:{" "}
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
                slotIndex === index ? "bg-purple-600 text-white" : "border border-gray-200"
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

        {/* Leave a Review Button */}
        <button
          onClick={() => navigate(`/review/${docInfo.id}`)}
          className="flex items-center gap-2 mt-6 px-5 py-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition duration-200 shadow-sm"
        >
          <FaStar />
          Leave a Review for Dr. {docInfo.firstName}
        </button>
      </div>

      {/* Related Doctors Section */}
      <RelatedDoctors docId={docInfo.id} speciality={docInfo.specialty} />
    </div>
  );
}

export default Appointment;
