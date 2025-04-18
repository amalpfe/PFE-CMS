import { useNavigate } from 'react-router-dom';
import { doctors } from '../assets/assets';

function TopDoctors() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
          onClick={()=>navigate(`/appointment/${item._id}`)}
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden shadow-md bg-white cursor-pointer hover:-translate-y-2 transition-transform duration-300"
          >
            <img className="w-full h-44 object-cover bg-blue-50" src={item.Image} alt={item.name} />
            <div className="p-4">
              <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
              </div>
              <p className="font-semibold text-base">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <button className="mt-8 px-6 py-2 bg-purple-700 text-white text-sm rounded-full hover:bg-purple-600 transition duration-300 shadow-md">
        More Doctors
      </button>
    </div>
  );
}

export default TopDoctors;
