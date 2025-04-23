import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Define the type for a Doctor
interface DoctorType {
  _id: string;
  name: string;
  speciality: string;
  Image: string;
  experience: number; // Make sure this is a number
}

interface RelatedDoctorsProps {
  docId: string;
  speciality: string;
}

const RelatedDoctors: React.FC<RelatedDoctorsProps> = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  
  // Ensure the data fetched from context is of type Doctor[]
  const doctors: any[] = context?.doctors || [];  // Temporarily using `any[]` to allow transformation

  const [relDocs, setRelDocs] = useState<DoctorType[]>([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      // Map the doctors and convert experience to a number
      const filtered = doctors
        .filter(
          (doc) =>
            doc.speciality.toLowerCase().trim() === speciality.toLowerCase().trim() &&
            doc._id !== docId
        )
        .map((doc) => ({
          ...doc,
          experience: parseInt(doc.experience, 10), // Convert experience to number
        }));

      // Now the `experience` property will be a number
      setRelDocs(filtered);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        Browse through more doctors in the same speciality.
      </p>

      {/* Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6 px-3 sm:px-0">
        {relDocs.length > 0 ? (
          relDocs.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden shadow-md bg-white cursor-pointer hover:-translate-y-2 transition-transform duration-300"
            >
              <img
                className="w-full h-44 object-cover bg-blue-50"
                src={item.Image}
                alt={item.name}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p>Available</p>
                </div>
                <p className="font-semibold text-base">{item.name}</p>
                <p className="text-sm text-gray-500">{item.speciality}</p>
                <p className="text-xs text-gray-400">{item.experience} yrs experience</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No related doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedDoctors;
