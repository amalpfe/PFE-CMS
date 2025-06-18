import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import verifiedIcon from "../assets/verified_icon.svg";
import { FaStar } from "react-icons/fa";
import RelatedDoctors from "../components/RelatedDoctors";
import { AppContext } from "../context/AppContext";

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

interface TimeSlot {
  datetime: Date;
  time: string;
  reserved: boolean;
}

function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const appContext = useContext(AppContext);
  const patientId = appContext?.user?.id;
  const currencySymbol = appContext?.currencySymbol || "$";

  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [docSlots, setDocSlots] = useState<TimeSlot[][]>([]);
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/patient/doctor/${docId}`);
        setDocInfo(response.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    if (docId) fetchDoctorDetails();
  }, [docId]);

useEffect(() => {
  const fetchReservedSlots = async () => {
    if (!docInfo?.id) return;
    try {
      const res = await axios.get(`http://localhost:5000/patient/appointments/${docInfo.id}`);
      console.log("Raw reserved slots response:", res.data);

      const times = res.data.map((a: any) =>
        new Date(a.appointmentDate).toISOString().slice(0, 16)
      );
      console.log("Processed reserved slots:", times);
      setReservedSlots(times);
    } catch (err) {
      console.error("Failed to fetch reserved slots:", err);
    }
  };

  if (docInfo) fetchReservedSlots();
}, [docInfo]);


 const getAvailableSlots = () => {
  if (!docInfo?.availability) return;

  const today = new Date();
  const newSlots: TimeSlot[][] = [];

  console.log("Reserved slots (ISO 16 chars):", reservedSlots); // debug reserved slots

  for (let i = 0; i < 20; i++) {
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

    const slots: TimeSlot[] = [];
    const isToday = i === 0;
    const now = new Date();

    while (start < end) {
      if (!isToday || start > now) {
        // Generate ISO string truncated to minutes (YYYY-MM-DDTHH:mm)
        const iso = start.toISOString().slice(0, 16);

        // DEBUG LOG
        console.log("Checking slot:", iso, "Reserved?", reservedSlots.includes(iso));

      slots.push({
  datetime: new Date(start),
  time: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  reserved: reservedSlots.includes(iso),
});

      }
      start.setMinutes(start.getMinutes() + 30);
    }
    newSlots.push(slots);
  }
  setDocSlots(newSlots);
};


  useEffect(() => {
    if (docInfo && reservedSlots.length >= 0) getAvailableSlots();
  }, [docInfo, reservedSlots]);

  useEffect(() => {
    setSlotTime("");
  }, [slotIndex]);

  const handleBooking = async () => {
    if (!slotTime || !docSlots[slotIndex]?.length || !patientId) return;

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
        setSlotTime("");
        getAvailableSlots(); // refresh after booking
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Already Reserved !! Please try again.";
      alert(message);
    }
  };

  if (!docInfo) return null;

  const doctorName = `${docInfo.firstName} ${docInfo.lastName}`;

  return (
    <div className="p-4 sm:p-8 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-6">
        <img
        src={
  typeof docInfo.image === "string" && docInfo.image.startsWith("data:")
    ? docInfo.image
    : `data:image/png;base64,${docInfo.image || ""}`
}

          alt="doctor"
          className="w-44 h-44 object-cover rounded-lg border"
        />

        <div className="flex-1 bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">{doctorName}</h2>
            <img src={verifiedIcon} alt="Verified" className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {docInfo.specialty} — {docInfo.degree}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>{docInfo.experience} years of experience</span>
          </div>
          <p className="mt-4 text-gray-600">{docInfo.about}</p>
          <div className="mt-4 text-gray-800 font-medium">
            Fees: {currencySymbol}
            {docInfo.fees}
          </div>
          <button
            onClick={() =>
              navigate(`/review/${docInfo.id}/${patientId}/${encodeURIComponent(doctorName)}`)
            }
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            See reviews or leave feedback
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Time Slots</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {docSlots.map((slots, idx) => {
            const day = new Date();
            day.setDate(day.getDate() + idx);
            const label = day.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            const isDisabled = slots.length === 0;

            return (
              <button
                key={idx}
                onClick={() => !isDisabled && setSlotIndex(idx)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-full border transition ${
                  isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : idx === slotIndex
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-blue-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {docSlots[slotIndex]
            ?.filter(slot => !slot.reserved) // <-- Filter reserved slots here
            .map((slot, i) => (
              <button
                key={i}
                onClick={() => setSlotTime(slot.time)}
                className={`py-2 px-4 border rounded transition ${
                  slotTime === slot.time
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-blue-100"
                }`}
              >
                {slot.time}
              </button>
            ))}
        </div>

        <button
          onClick={handleBooking}
          disabled={!slotTime}
          className="mt-6 px-6 py-2 bg-green-600 text-white font-medium rounded disabled:opacity-50"
        >
          Book Appointment
        </button>

        {showSuccess && (
          <div className="mt-4 text-green-600 font-semibold">
            Appointment booked successfully!
          </div>
        )}
      </div>

      <div className="mt-10">
        <RelatedDoctors speciality={docInfo.specialty} docId={docInfo.id} />
      </div>
    </div>
  );
}

export default Appointment;
