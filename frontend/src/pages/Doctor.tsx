import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DoctorType {
  id: string;
  name: string;
  speciality: string;
  Image: string;
}


const Doctor = () => {
  const { speciality } = useParams<{ speciality: string }>();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [filterDoc, setFilterDoc] = useState<DoctorType[]>([]);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/patient/doctors");
        const data = await res.json();
        setDoctors(data);


      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on speciality
  useEffect(() => {
    if (speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality.toLowerCase() === speciality.toLowerCase()
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);
  

  const specialities = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="py-10 px-6 md:px-10 lg:px-20">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">
        Browse Our Specialist Doctors
      </h1>

      {/* Speciality Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {specialities.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(`/doctors/${item}`)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              speciality?.toLowerCase() === item.toLowerCase()
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-purple-100"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => navigate(`/doctors`)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
        >
          Clear Filter
        </button>
      </div>

      {/* Doctors Grid or Empty Message */}
      {filterDoc.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filterDoc.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                 onClick={() => navigate(`/appointment/${item.id}`)}
                className="border border-purple-100 rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer hover:-translate-y-1 hover:shadow-md transition-transform duration-300"
              >
 <img src={item.Image} alt={item.name} />

                <div className="p-4">
                  <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p>Available</p>
                  </div>
                  <p className="font-semibold text-base text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.speciality}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-gray-500 mt-10 text-lg"
        >
          No doctors found for this speciality.
        </motion.p>
      )}
    </div>
  );
};

export default Doctor;
