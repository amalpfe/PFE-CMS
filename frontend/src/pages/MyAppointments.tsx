import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

type DoctorAppointment = {
  appointmentId: number;
  appointmentDate: string;
  appointmentStatus: string;
  notes: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  doctorImage: string;
  address: string;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

const MyAppointments = () => {
  const context = useContext(AppContext);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAppointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const patientId = context?.user?.id; // Assuming user is stored in context

  useEffect(() => {
    if (!patientId) return;
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/patient/appointments/${patientId}`);
        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const openModal = (doctor: DoctorAppointment) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setPaymentMethod("Credit Card");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handlePaymentSubmit = () => {
    console.log("Processing payment with:", {
      doctor: selectedDoctor?.doctorName,
      amount: "$50",
      method: paymentMethod,
      status: "Pending",
    });
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
      <p className="text-2xl font-bold text-purple-800 pb-4 border-b mb-8">
        My Appointments
      </p>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        appointments.map((appointment, index) => (
          <motion.div
            key={index}
            className="grid sm:grid-cols-[1fr_2fr_auto] gap-6 items-center py-6 border-b"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 bg-indigo-50">
              <img
                src={appointment.doctorImage}
                alt={appointment.doctorName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-lg font-semibold text-neutral-800">{appointment.doctorName}</p>
              <p className="text-sm text-gray-500 mb-2">{appointment.specialty}</p>
              <div className="text-sm text-gray-700">
                <p className="font-medium text-zinc-700">Address:</p>
                <p className="text-xs">{appointment.address}</p>
              </div>
              <p className="text-sm mt-3">
                <span className="text-neutral-700 font-medium">Date & Time:</span>{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Status:</span> {appointment.appointmentStatus}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => openModal(appointment)}
                className="text-sm text-purple-700 border border-purple-500 py-2 rounded hover:bg-purple-700 hover:text-white transition-all duration-300"
              >
                Pay Online
              </button>
              <button
                className="text-sm text-red-600 border border-red-500 py-2 rounded hover:bg-red-700 hover:text-white transition-all duration-300"
                onClick={() => {
                  setSelectedDoctor(appointment);
                  setShowCancelModal(true);
                }}
              >
                Cancel Appointment
              </button>
            </div>
          </motion.div>
        ))
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && selectedDoctor && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Payment Details</h3>
              <p><span className="font-medium text-gray-700">Doctor:</span> Dr. {selectedDoctor.doctorName}</p>
              <p><span className="font-medium text-gray-700">Amount:</span> $50.00</p>
              <p><span className="font-medium text-gray-700">Payment Status:</span> Pending</p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Cash</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to cancel this appointment?
              </h3>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => {
                    console.log("Cancelled appointment for:", selectedDoctor?.doctorName);
                    setShowCancelModal(false);
                    setSelectedDoctor(null);
                  }}
                >
                  Yes, Cancel
                </button>
                <button
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
                  onClick={() => setShowCancelModal(false)}
                >
                  No, Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
