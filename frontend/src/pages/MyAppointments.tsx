import { useContext } from "react";
import { AppContext } from "../context/AppContext"; // Import AppContext

const MyAppointments = () => {
  // Use the context safely by checking if it's defined
  const context = useContext(AppContext);

  // If context is undefined (should not happen if wrapped correctly)
  if (!context) {
    return <p className="text-red-600 text-center mt-10">Context not found!</p>;
  }

  const { doctors } = context; // Get doctors from context

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
      <p className="text-2xl font-bold text-purple-800 pb-4 border-b mb-8">
      My Appointments
      </p>
      <div>
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            {/* Doctor Image */}
            <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 bg-indigo-50" >
              <img
                src={item.Image}
                alt={item.name}
                className="w-32 bg-indigo-50"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 mt-4 sm:mt-0">
              <p className="text-neutral-800 font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500 mb-4">{item.speciality}</p>
              <div className="text-sm text-gray-700 mb-4">
                <p className="font-medium text-zinc-700 mt-1">Address:</p>
                <p className="text-xs">{item.address.line1}</p>
                <p  className="text-xs">{item.address.line2}</p>
              </div>
              <p className="text-sm mt-1">
                <span className=" text-neutral-700 font-medium">Date & Time: </span>
                18, April, 2025 | 8:30 PM
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 justify-end">
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-purple-600 hover:text-white transition-all duration-300">
              Pay Online
              </button>
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-700 hover:text-white transition-all duration-300">
              Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
