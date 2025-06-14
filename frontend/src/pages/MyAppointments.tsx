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
  const [successMessage, setSuccessMessage] = useState<string>("");

  const patientId = context?.user?.id;

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

  const handleCancelAppointment = async () => {
    if (!selectedDoctor) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/patient/cancel-appointment/${selectedDoctor.appointmentId}`
      );

      if (response.data.success) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.appointmentId === selectedDoctor.appointmentId
              ? { ...app, appointmentStatus: "Cancelled" }
              : app
          )
        );
        setShowCancelModal(false);
        setSelectedDoctor(null);

        setSuccessMessage("Appointment cancelled successfully.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-white rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 border-b pb-4">
        My Appointments
      </h2>

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
          {successMessage}
        </div>
      )}

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No appointments found.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment, index) => (
            <motion.div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-lg border shadow-sm bg-gray-50"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex-shrink-0">
                <img
                  src={appointment.doctorImage}
                  alt={appointment.doctorName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{appointment.doctorName}</h3>
                <p className="text-sm text-purple-600 mb-2">{appointment.specialty}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {appointment.address}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      appointment.appointmentStatus === "Cancelled"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {appointment.appointmentStatus}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openModal(appointment)}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded border border-purple-300 hover:bg-purple-700 hover:text-white transition"
                  disabled={appointment.appointmentStatus === "Cancelled"}
                >
                  Pay Online
                </button>
                <button
                  onClick={() => {
                    setSelectedDoctor(appointment);
                    setShowCancelModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-red-100 text-red-700 rounded border border-red-300 hover:bg-red-600 hover:text-white transition"
                  disabled={appointment.appointmentStatus === "Cancelled"}
                >
                  Cancel Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && selectedDoctor && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Payment Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Doctor:</span> Dr. {selectedDoctor.doctorName}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> $50.00
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span> Pending
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Payment Method:
                </label>
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
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to cancel this appointment?
              </h3>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={handleCancelAppointment}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
